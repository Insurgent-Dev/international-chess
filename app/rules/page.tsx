"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, Shield, Castle, Zap, BookOpen, User, Hexagon } from 'lucide-react';

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-[#050505] text-white p-8 overflow-x-hidden selection:bg-cyan-500/30">
            {/* Dynamic Background */}
            <div className="fixed inset-0 grid-bg opacity-20 pointer-events-none" />
            <div className="fixed inset-0 scanline opacity-30 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-b from-transparent via-cyan-900/5 to-transparent pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-12 text-center">
                    <h1 className="grand-logo flowing-neon tracking-tighter text-center mb-4 text-6xl">
                        GAME RULES<br />
                        <span className="text-[0.4em] tracking-[0.2em] opacity-80 font-sans font-bold">กฎกติกาหมากรุกสากล</span>
                    </h1>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mb-8" />

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 glass-panel border-cyan-500/30 hover:bg-cyan-500/10 transition-all rounded-full uppercase tracking-widest text-xs font-bold text-cyan-400 hover:scale-105"
                    >
                        <ArrowLeft size={16} /> กลับสู่สนามรบ
                    </Link>
                </header>

                <div className="space-y-12">

                    {/* Introduction */}
                    <section className="glass-panel border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <BookOpen size={120} />
                        </div>
                        <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-cyan-400">
                            <Shield className="animate-pulse" />
                            เป้าหมายของเกม (Objective)
                        </h2>
                        <p className="text-lg leading-relaxed text-gray-300">
                            เป้าหมายสูงสุดของหมากรุกสากลคือการ <strong className="text-white">"รุกฆาต" (Checkmate)</strong> ขุน (King) ของฝ่ายตรงข้าม
                            ซึ่งหมายถึงสถานการณ์ที่ขุนถูกโจมตี (รุก) และไม่มีตาเดินหนี ไม่สามารถเอาตัวมาบัง หรือกินตัวที่มารุกได้
                        </p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <span className="bg-green-500/10 text-green-400 px-4 py-2 rounded-lg text-sm font-bold border border-green-500/20">ชนะ (Win): รุกฆาตสำเร็จ / คู่ต่อสู้ยอมแพ้ / เวลาหมด</span>
                            <span className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-lg text-sm font-bold border border-yellow-500/20">เสมอ (Draw): Stalemate / เดินซ้ำ 3 ครั้ง / หมากไม่พอ</span>
                        </div>
                    </section>

                    {/* Piece Movements */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <Crown size={24} />
                                </div>
                                <h3 className="text-xl font-bold">King (ขุน)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินได้ 1 ช่องรอบตัวในทุกทิศทาง (เป็นหมากที่สำคัญที่สุด ห้ามถูกกิน)</p>
                        </div>

                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <Crown size={24} className="rotate-180 opacity-50" /> {/* Simulating Queen icon */}
                                </div>
                                <h3 className="text-xl font-bold">Queen (ควีน)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินได้ไม่จำกัดช่อง ทั้งแนวตั้ง แนวนอน และแนวทแยง (เก่งที่สุดในกระดาน)</p>
                        </div>

                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <Castle size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Rook (เรือ)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินแนวตั้งและแนวนอนได้ไม่จำกัดช่อง</p>
                        </div>

                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <Zap size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Bishop (บิชอป)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินแนวทแยงมุมได้ไม่จำกัดช่อง (อยู่สีไหนต้องเดินสีนั้นตลอดเกม)</p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <Hexagon size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Knight (ม้า)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินเป็นรูปตัว L (2 ช่องทางหนึ่ง แล้วเลี้ยว 1 ช่อง) และเป็นหมากตัวเดียวที่สามารถกระโดดข้ามตัวอื่นได้</p>
                        </div>

                        <div className="glass-panel border-white/5 p-6 rounded-2xl hover:bg-white/5 transition-all">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/30 flex items-center justify-center text-cyan-400">
                                    <User size={24} />
                                </div>
                                <h3 className="text-xl font-bold">Pawn (เบี้ย)</h3>
                            </div>
                            <p className="text-sm opacity-70">เดินหน้า 1 ช่อง (เดิน 2 ช่องได้ในตาแรก) แต่กินแนวทแยง (ถ้าเดินไปสุดกระดานจะเปลี่ยนร่างได้)</p>
                        </div>
                    </section>


                    {/* Special Moves */}
                    <section className="glass-panel border-white/5 p-8 rounded-3xl relative overflow-hidden">
                        <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-amber-400">
                            <Zap className="animate-pulse" />
                            ท่าพิเศษ (Special Moves)
                        </h2>

                        <div className="space-y-6">
                            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
                                <h3 className="text-xl font-bold text-white mb-2">Castling (การเข้าป้อม)</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    การเดิน King และ Rook พร้อมกันเพื่อความปลอดภัย<br />
                                    1. King และ Rook ต้องไม่เคยขยับมาก่อน<br />
                                    2. ไม่มีตัวหมากคั่นกลาง<br />
                                    3. King ต้องไม่ถูกรุก (Check) อยู่
                                </p>
                            </div>

                            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
                                <h3 className="text-xl font-bold text-white mb-2">En Passant (การกินผ่าน)</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    ท่าจับกินพิเศษของเบี้ย เมื่อคู่ต่อสู้เดินเบี้ย 2 ช่องผ่านหน้าเบี้ยเราข้างๆ
                                    เราสามารถจับกินเบี้ยตัวนั้นได้ทันทีในตาถัดไป
                                </p>
                            </div>

                            <div className="border-l-4 border-amber-500/50 pl-6 py-2">
                                <h3 className="text-xl font-bold text-white mb-2">Promotion (การเลื่อนยศ)</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    เมื่อเบี้ยเดินไปถึงแถวสุดท้ายของฝ่ายตรงข้าม จะต้องเปลี่ยนร่างเป็น Queen, Rook, Bishop หรือ Knight ทันที
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
                    <p>Confirmed compliant with FIDE (International Chess Federation) Rules</p>
                    <p className="opacity-50 mt-2">CHESS AI UNIVERSE v4.0.2</p>
                </footer>
            </div>
        </div>
    );
}
