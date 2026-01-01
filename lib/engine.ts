import { Chess, Move } from 'chess.js';

// Piece weights for evaluation
const PIECE_VALUES: Record<string, number> = {
    p: 10,
    n: 30,
    b: 30,
    r: 50,
    q: 90,
    k: 900,
};

// Evaluation function
const evaluateBoard = (game: Chess): number => {
    let totalEvaluation = 0;
    const board = game.board();

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const value = PIECE_VALUES[piece.type] || 0;
                totalEvaluation += piece.color === 'w' ? value : -value;
            }
        }
    }
    return totalEvaluation;
};

// Minimax with Alpha-Beta Pruning
export const minimax = (
    game: Chess,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean
): number => {
    if (depth === 0) {
        return -evaluateBoard(game);
    }

    const moves = game.moves();

    if (isMaximizingPlayer) {
        let bestEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer);
            game.undo();
            bestEval = Math.max(bestEval, evaluation);
            alpha = Math.max(alpha, bestEval);
            if (beta <= alpha) break;
        }
        return bestEval;
    } else {
        let bestEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evaluation = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer);
            game.undo();
            bestEval = Math.min(bestEval, evaluation);
            beta = Math.min(beta, bestEval);
            if (beta <= alpha) break;
        }
        return bestEval;
    }
};

export const findBestMove = (game: Chess, level: number): string => {
    const moves = game.moves();

    // Level 1: Random moves (Nong Nob)
    if (level === 1) {
        return moves[Math.floor(Math.random() * moves.length)];
    }

    // Level 2: Depth 2 (Pro Kao)
    const depth = level === 2 ? 2 : (level === 3 ? 3 : 4);

    let bestMove = '';
    let bestValue = -Infinity;

    // Simple shuffle to add variety
    moves.sort(() => Math.random() - 0.5);

    for (const move of moves) {
        game.move(move);
        const boardValue = minimax(game, depth - 1, -Infinity, Infinity, false);
        game.undo();

        if (boardValue > bestValue) {
            bestValue = boardValue;
            bestMove = move;
        }
    }

    return bestMove || moves[0];
};
