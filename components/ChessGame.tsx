"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';

import Link from 'next/link';
import { Chess, Move } from 'chess.js';
import {
    ChessKing, ChessQueen, ChessRook, ChessBishop, ChessKnight, ChessPawn,
    RotateCcw, Users, Timer, ChevronRight, BookOpen
} from 'lucide-react';
import { PERSONALITIES, Personality } from '@/lib/personalities';
import { findBestMove } from '@/lib/engine';
import { audioManager } from '@/lib/audio';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const PIECE_ICONS: Record<string, any> = {
    p: ChessPawn,
    r: ChessRook,
    n: ChessKnight,
    b: ChessBishop,
    q: ChessQueen,
    k: ChessKing,
};

export default function ChessGame() {
    const [game, setGame] = useState(new Chess());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [opponent, setOpponent] = useState<Personality>(PERSONALITIES[0]);
    const [chatMessage, setChatMessage] = useState<string>(opponent.quotes.start[0]);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [timer, setTimer] = useState(30);
    const [showOpponentSelector, setShowOpponentSelector] = useState(true);
    const [isThinking, setIsThinking] = useState(false);
    const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
    const [effectKey, setEffectKey] = useState(0); // Trigger re-animation
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Generate random particles once on client to avoid hydration mismatch and flickering
    const particles = useMemo(() => {
        if (!isMounted) return [];
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            width: Math.random() * 4 + 'px',
            height: Math.random() * 4 + 'px',
            left: Math.random() * 100 + 'vw',
            animationDelay: Math.random() * 10 + 's',
            color: PERSONALITIES[i % 4].theme === 'blue' ? '#22d3ee' : PERSONALITIES[i % 4].theme === 'amber' ? '#fbbf24' : PERSONALITIES[i % 4].theme === 'purple' ? '#a855f7' : '#ef4444'
        }));
    }, [isMounted]);

    // Sound Effects
    const playSound = (type: 'move' | 'capture' | 'win' | 'loss') => {
        switch (type) {
            case 'move': audioManager.playMove(); break;
            case 'capture': audioManager.playCapture(); break;
            case 'win': audioManager.playWin(); break;
            case 'loss': audioManager.playLoss(); break;
        }
    };

    const makeMove = useCallback((move: string | { from: string; to: string; promotion?: string }) => {
        try {
            const result = game.move(move);
            if (result) {
                setGame(new Chess(game.fen()));
                setMoveHistory(prev => [...prev, typeof move === 'string' ? move : `${move.from}-${move.to}`]);
                setLastMove(typeof move === 'string' ? null : { from: move.from, to: move.to });
                setEffectKey(prev => prev + 1);


                if (result.captured) playSound('capture');
                else playSound('move');

                if (game.isGameOver()) {
                    setIsGameOver(true);
                    if (game.isCheckmate()) {
                        setChatMessage(game.turn() === 'w' ? opponent.quotes.win[0] : opponent.quotes.loss[0]);
                        playSound(game.turn() === 'w' ? 'loss' : 'win');
                    } else {
                        setChatMessage(opponent.quotes.draw[0]);
                    }
                }
                return true;
            }
        } catch (e) {
            return false;
        }
        return false;
    }, [game, opponent]);

    const onSquareClick = (square: string) => {
        if (isGameOver || showOpponentSelector) return;

        if (selectedSquare === square) {
            setSelectedSquare(null);
            return;
        }

        const move = makeMove({ from: selectedSquare || '', to: square, promotion: 'q' });

        if (move) {
            setSelectedSquare(null);
            // Trigger AI Move after a short delay
            setTimeout(makeAiMove, 500);
        } else {
            const piece = game.get(square as any);
            if (piece && piece.color === 'w') {
                setSelectedSquare(square);
            }
        }
    };

    const makeAiMove = useCallback(() => {
        if (game.isGameOver() || isThinking) return;

        setIsThinking(true);

        // Delay based on level for "realism"
        const delay = opponent.id === 'nong-nob' ? 1000 : 2000;

        setTimeout(() => {
            // Map personality to level (1-4)
            const levelMap: Record<string, number> = {
                'nong-nob': 1,
                'pro-kao': 2,
                'master-meow': 3,
                'thunder-god': 4
            };

            const level = levelMap[opponent.id] || 1;
            const bestMove = findBestMove(game, level);

            const result = game.move(bestMove);
            setGame(new Chess(game.fen()));
            setLastMove({ from: result.from, to: result.to });
            setEffectKey(prev => prev + 1);
            setIsThinking(false);
            setTimer(30);


            if (result.captured) {
                const captureQuotes = opponent.quotes.aiCapture;
                setChatMessage(captureQuotes[Math.floor(Math.random() * captureQuotes.length)]);
                playSound('capture');
            } else {
                if (Math.random() > 0.7) {
                    const moveQuotes = opponent.quotes.aiMove;
                    setChatMessage(moveQuotes[Math.floor(Math.random() * moveQuotes.length)]);
                }
                playSound('move');
            }

            if (game.isGameOver()) {
                setIsGameOver(true);
                if (game.isCheckmate()) {
                    const winQuotes = opponent.quotes.win;
                    setChatMessage(winQuotes[Math.floor(Math.random() * winQuotes.length)]);
                    playSound('win');
                } else {
                    setChatMessage(opponent.quotes.draw[0]);
                }
            }
        }, delay);
    }, [game, opponent, isThinking]);

    const resetGame = (p?: Personality) => {
        const activePersonality = p || opponent;
        setGame(new Chess());
        setMoveHistory([]);
        setIsGameOver(false);
        setTimer(30);
        setChatMessage(activePersonality.quotes.start[Math.floor(Math.random() * activePersonality.quotes.start.length)]);
    };

    const selectOpponent = (p: Personality) => {
        setOpponent(p);
        setShowOpponentSelector(false);
        resetGame(p);
    };

    useEffect(() => {
        if (!isGameOver && !showOpponentSelector) {
            const interval = setInterval(() => {
                setTimer(t => {
                    if (t <= 1) {
                        // Randomly pick a move if time runs out
                        makeAiMove();
                        return 30;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isGameOver, showOpponentSelector, game]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden" data-theme={opponent.theme}>
            {/* Dynamic Background */}
            <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="fixed inset-0 scanline opacity-30 pointer-events-none" />

            {/* Background Glow */}
            <div
                className="fixed inset-0 opacity-10 blur-[100px] transition-colors duration-1000 pointer-events-none"
                style={{ backgroundColor: `var(--theme-color)` }}
            />

            {/* Header */}
            <header className="relative z-10 mb-12 flex flex-col items-center">
                <div className="relative group">
                    <div className="absolute -inset-8 bg-[var(--theme-color)] opacity-10 blur-3xl group-hover:opacity-20 transition-opacity duration-1000 pointer-events-none" />
                    <h1 className="grand-logo flowing-neon tracking-tighter text-center">
                        CHESS AI<br />
                        <span className="text-[0.6em] tracking-[0.2em] opacity-90">UNIVERSE</span>
                    </h1>


                </div>
                <div className="flex gap-6 items-center mt-2 group">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--theme-color)] group-hover:w-32 transition-all duration-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--theme-color)] animate-pulse">
                        System Protocol v4.0.2
                    </span>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--theme-color)] group-hover:w-32 transition-all duration-500" />
                </div>
            </header>


            <main className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

                {/* Board Section */}
                <div className="flex flex-col items-center space-y-6">
                    <div className="perspective-container w-full max-w-[600px] aspect-square">
                        <div className="board-3d neon-border glass-panel p-2 rounded-lg">
                            <div className="grid grid-cols-8 grid-rows-8 w-full h-full bg-black/40">
                                {Array.from({ length: 64 }).map((_, i) => {
                                    const row = Math.floor(i / 8);
                                    const col = i % 8;
                                    const square = String.fromCharCode(97 + col) + (8 - row);
                                    const piece = game.get(square as any);
                                    const isLight = (row + col) % 2 === 0;
                                    const isSelected = selectedSquare === square;
                                    const isLastMoveTarget = lastMove?.to === square;
                                    const canMoveTo = selectedSquare && game.moves({ square: selectedSquare as any, verbose: true }).some(m => m.to === square);
                                    const isCapture = canMoveTo && piece;

                                    const PieceIcon = piece ? PIECE_ICONS[piece.type] : null;


                                    return (
                                        <div
                                            key={square}
                                            onClick={() => onSquareClick(square)}
                                            className={cn(
                                                "relative flex items-center justify-center cursor-pointer transition-all duration-200 border-[0.5px] border-white/5",
                                                isLight ? "bg-white/5" : "bg-transparent",
                                                isSelected && "bg-[var(--theme-color)]/20 shadow-[inset_0_0_15px_var(--theme-color)]",
                                                canMoveTo && "after:content-[''] after:w-3 after:h-3 after:rounded-full after:bg-[var(--theme-color)]/40 after:absolute",
                                                isCapture && "after:w-full after:h-full after:bg-red-500/20 after:border-2 after:border-red-500/40",
                                                "hover:bg-[var(--theme-color)]/10"
                                            )}
                                        >
                                            {PieceIcon && (
                                                <PieceIcon
                                                    className={cn(
                                                        "w-4/5 h-4/5 piece-glass transition-all duration-300",
                                                        piece?.color === 'w' ? "piece-glass-white" : "piece-glass-black",
                                                        isSelected && "scale-125"
                                                    )}
                                                    strokeWidth={1.5}
                                                />
                                            )}

                                            {/* Visual Effects */}
                                            {isLastMoveTarget && (
                                                <div key={effectKey} className="move-ripple" />
                                            )}


                                            {/* Coordinates (Subtle) */}
                                            {col === 0 && <span className="absolute left-0.5 top-0.5 text-[8px] opacity-30">{8 - row}</span>}
                                            {row === 7 && <span className="absolute right-0.5 bottom-0.5 text-[8px] opacity-30">{String.fromCharCode(97 + col)}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={() => resetGame()}
                            className="glass-panel neon-border px-6 py-2 flex items-center gap-2 hover:bg-[var(--theme-color)]/20 transition-all uppercase tracking-widest text-xs font-bold"
                        >

                            <RotateCcw size={16} /> Reset Game
                        </button>
                        <button
                            onClick={() => setShowOpponentSelector(true)}
                            className="glass-panel border-white/20 px-6 py-2 flex items-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold"
                        >
                            <Users size={16} /> Switch AI
                        </button>
                        <Link
                            href="/rules"
                            className="glass-panel border-white/20 px-6 py-2 flex items-center gap-2 hover:bg-white/10 transition-all uppercase tracking-widest text-xs font-bold text-white/70 hover:text-[var(--theme-color)]"
                        >
                            <BookOpen size={16} /> Rules
                        </Link>
                    </div>
                </div>

                {/* Info & Side Panel */}
                <div className="flex flex-col gap-6">

                    {/* AI Chat Box */}
                    <div className={cn(
                        "glass-panel neon-border p-6 rounded-2xl relative min-h-[160px] flex flex-col justify-between overflow-hidden transition-all duration-500",
                        isThinking && "thinking-pulse"
                    )}>
                        <div className="absolute top-0 right-0 p-2 opacity-50 text-[10px] font-mono">
                            {isThinking ? "ENCRYPTING..." : "SECURE CHANNEL"}
                        </div>
                        <div className="flex items-start gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-full glass-panel neon-border flex items-center justify-center font-bold text-xl text-[var(--theme-color)] transition-all duration-1000",
                                isThinking && "animate-pulse"
                            )}>
                                {opponent.avatar}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold opacity-70 uppercase tracking-widest">{opponent.name} <span className="text-[10px] bg-[var(--theme-color)]/20 px-1 py-0.5 rounded text-[var(--theme-color)] ml-2">{opponent.level}</span></h3>
                                <p className="mt-2 text-lg italic leading-tight text-white/90">
                                    "{isThinking ? "Calculating perfect move..." : chatMessage}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Game Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center">
                            <span className="text-[10px] uppercase opacity-50 mb-1">Turn Timer</span>
                            <div className="flex items-center gap-2 text-2xl font-mono text-[var(--theme-color)]">
                                <Timer size={20} />
                                {timer}s
                            </div>
                        </div>
                        <div className="glass-panel p-4 rounded-xl flex flex-col items-center">
                            <span className="text-[10px] uppercase opacity-50 mb-1">Game Status</span>
                            <div className="text-xl font-bold uppercase tracking-tighter">
                                {game.turn() === 'w' ? 'Your Move' : "AI Thinking"}
                            </div>
                        </div>
                    </div>

                    {/* Move History */}
                    <div className="glass-panel p-4 rounded-xl flex-1 max-h-[300px] overflow-y-auto">
                        <h4 className="text-[10px] uppercase opacity-50 mb-2 font-bold tracking-widest">Digital Log</h4>
                        <div className="space-y-1 font-mono text-sm opacity-80">
                            {moveHistory.length === 0 && <div className="text-xs italic opacity-30">No data transmitted...</div>}
                            {Array.from({ length: Math.ceil(moveHistory.length / 2) }).map((_, i) => (
                                <div key={i} className="flex justify-between border-b border-white/5 py-1">
                                    <span className="opacity-40">{i + 1}.</span>
                                    <span className="flex-1 px-4">{moveHistory[i * 2]}</span>
                                    <span className="flex-1">{moveHistory[i * 2 + 1] || '...'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Opponent Selector Overlay */}
            {showOpponentSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center selection-overlay backdrop-blur-2xl p-8 overflow-hidden">
                    {/* Floating Particles for Background */}
                    {particles.map((p) => (
                        <div
                            key={p.id}
                            className="particle"
                            style={{
                                width: p.width,
                                height: p.height,
                                left: p.left,
                                animationDelay: p.animationDelay,
                                '--theme-color': p.color
                            } as any}
                        />
                    ))}


                    <div className="max-w-6xl w-full relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-5xl font-black mb-4 uppercase tracking-[0.3em] italic shimmer-text leading-tight">
                                SELECT YOUR ADVERSARY
                            </h2>
                            <div className="h-px w-64 bg-gradient-to-r from-transparent via-[var(--theme-color)] to-transparent mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {PERSONALITIES.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => selectOpponent(p)}
                                    className={cn(
                                        "holographic-card glass-panel border-white/5 p-8 rounded-[2rem] cursor-pointer group"
                                    )}
                                    style={{ '--theme-color': p.theme === 'blue' ? '#22d3ee' : p.theme === 'amber' ? '#fbbf24' : p.theme === 'purple' ? '#a855f7' : '#ef4444' } as any}
                                >
                                    <div className="card-glint" />

                                    <div className="relative mb-8">
                                        <div className="w-20 h-20 rounded-full glass-panel border-white/10 flex items-center justify-center font-black text-3xl group-hover:neon-border transition-all duration-500 scale-110 group-hover:scale-125 z-10 relative bg-black/50">
                                            {p.avatar}
                                        </div>
                                        <div className="absolute inset-0 bg-[var(--theme-color)] opacity-0 group-hover:opacity-20 blur-2xl rounded-full transition-opacity duration-500" />
                                    </div>

                                    <h3 className="text-2xl font-black mb-2 group-hover:text-[var(--theme-color)] transition-colors duration-300 flex items-center gap-2">
                                        {p.name}
                                    </h3>

                                    <div className="text-[12px] font-black uppercase tracking-[0.2em] bg-[var(--theme-color)]/10 text-[var(--theme-color)] px-3 py-1 rounded-full border border-[var(--theme-color)]/20 inline-block mb-4">
                                        {p.level}
                                    </div>

                                    <p className="text-sm opacity-50 leading-relaxed mb-6 group-hover:opacity-80 transition-opacity">
                                        {p.description}
                                    </p>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-[var(--theme-color)]">
                                        <span>Initiate Link</span>
                                        <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            {/* Game Over Overlay */}
            {isGameOver && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md">
                    <div className="text-center p-12 glass-panel neon-border rounded-3xl animate-in zoom-in duration-500">
                        <h2 className="text-6xl font-black italic uppercase tracking-tighter mb-4 neon-text">
                            {game.isCheckmate() ? (game.turn() === 'w' ? 'System Failure' : 'Mission Victory') : 'STALEMATE'}
                        </h2>
                        <p className="text-xl opacity-80 mb-8 max-w-md mx-auto italic">
                            "{chatMessage}"
                        </p>
                        <button
                            onClick={() => resetGame()}
                            className="px-12 py-4 bg-[var(--theme-color)] text-black font-black uppercase tracking-[0.3em] hover:scale-105 transition-all rounded-full shadow-[0_0_30px_var(--theme-color)]"
                        >
                            Reboot System
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
