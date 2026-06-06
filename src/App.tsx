import React, { useEffect, useRef } from 'react';
import { Web3Provider } from './components/Web3Provider';
import { useGameEngine } from './game/engine';
import { COLS, ROWS, COLORS, SHAPES } from './game/constants';
import { useAccount, useSendTransaction, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { Sun } from 'lucide-react';

function GameInterface() {
  const { grid, piece, food, gameState, snakeLength, combo, nextPiece, startGame, movePiece } = useGameEngine();
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction } = useSendTransaction();

  const sendGMTransaction = () => {
    sendTransaction({
      to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
      data: '0x', // basic transaction
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameState.isPlaying) return;
      switch(e.code) {
        case 'ArrowLeft': 
          movePiece(-1, 0, false); 
          e.preventDefault();
          break;
        case 'ArrowRight': 
          movePiece(1, 0, false); 
          e.preventDefault();
          break;
        case 'ArrowDown': 
          movePiece(0, 1, false); 
          e.preventDefault();
          break;
        case 'ArrowUp': 
          movePiece(0, 0, true); 
          e.preventDefault();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isPlaying, movePiece]);

  // Touch controls
  const touchStartRef = useRef<{x: number, y: number} | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !gameState.isPlaying) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
      if (dx > 0) movePiece(1, 0, false);
      else movePiece(-1, 0, false);
    } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
      if (dy > 0) movePiece(0, 1, false);
      else movePiece(0, 0, true);
    }
    touchStartRef.current = null;
  };

  return (
    <div className="w-full h-full min-h-screen bg-[#050505] text-white flex flex-col p-2 sm:p-6 overflow-hidden border-8 border-[#1a1a1a] font-sans select-none">
      {/* TOP HUD */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 sm:mb-8 border-b border-[#333] pb-4 shrink-0">
        <div className="flex flex-col mb-4 sm:mb-0">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[10px] tracking-[0.3em] uppercase opacity-50">On-Chain Protocol: Base Mainnet</span>
            {!isConnected ? (
              <button 
                onClick={() => connect({ connector: injected() })}
                className="text-[10px] tracking-widest uppercase bg-[#333] hover:bg-[#444] px-2 py-1 rounded transition-colors"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => disconnect()}
                  className="text-[10px] tracking-widest uppercase opacity-50 hover:opacity-100 transition-opacity"
                >
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </button>
                <button 
                  onClick={sendGMTransaction}
                  className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
                >
                  <Sun size={14} />
                  Say GM
                </button>
              </div>
            )}
          </div>
          <h1 className="text-5xl sm:text-7xl font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#00FFFF] via-[#FF00FF] to-[#39FF14]">
            SNAKTRIS
          </h1>
        </div>
        
        <div className="flex gap-4 sm:gap-12 text-right">
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Score</p>
            <p className="text-2xl sm:text-4xl font-mono tracking-tight text-[#00FFFF]">{gameState.score}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Level</p>
            <p className="text-2xl sm:text-4xl font-mono tracking-tight text-[#FF00FF]">{gameState.level}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest opacity-40">Lines</p>
            <p className="text-2xl sm:text-4xl font-mono tracking-tight text-[#39FF14]">{gameState.lines}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-8 min-h-0 overflow-y-auto lg:overflow-hidden pb-12 lg:pb-0">
        {/* LEFT SIDEBAR: STATS & NEXT */}
        <aside className="w-full lg:w-64 flex flex-row lg:flex-col gap-4 sm:gap-6 shrink-0">
          <div className="bg-[#111] border-l-4 border-[#FF00FF] p-4 flex-1 lg:flex-none">
            <h3 className="text-xs uppercase font-bold tracking-widest mb-4 opacity-70">Next Piece</h3>
            <div className="grid grid-cols-4 gap-1 w-24">
              {Array.from({length: 16}).map((_, i) => {
                const lx = (i % 4) - 1;
                const ly = Math.floor(i / 4) - 1;
                const shape = SHAPES[nextPiece];
                const isActive = shape && shape.some(pt => pt.x === lx && pt.y === ly);
                const c = isActive ? COLORS[nextPiece] : 'transparent';
                const shadow = isActive ? `0 0 10px ${c}` : 'none';
                return <div key={i} className="w-5 h-5" style={{ backgroundColor: c, boxShadow: shadow }}/>;
              })}
            </div>
          </div>

          <div className="bg-[#111] border-l-4 border-[#00FFFF] p-4 flex-1 flex flex-col justify-between lg:justify-start">
            <h3 className="text-xs uppercase font-bold tracking-widest mb-4 opacity-70">Snake Bio</h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] opacity-40">LENGTH</p>
                <div className="w-full bg-[#222] h-2 mt-1 relative overflow-hidden">
                  <div className="bg-[#00FFFF] h-full absolute left-0 top-0 transition-all" style={{ width: `${Math.min(100, snakeLength * 2)}%` }}></div>
                </div>
                <p className="text-right text-xs mt-1">{snakeLength} Blocks</p>
              </div>
              <div>
                <p className="text-[10px] opacity-40">VELOCITY</p>
                <p className="text-lg font-mono">{(1.0 + gameState.level * 0.1).toFixed(1)} Mach</p>
              </div>
              <div>
                <p className="text-[10px] opacity-40">COMBO METER</p>
                <p className="text-2xl italic font-black text-[#FF00FF]">x{combo.toFixed(1)}</p>
              </div>
            </div>
          </div>

          <div className="mt-auto hidden lg:block">
            <button 
              onClick={() => { alert('Transaction simulated! (Requires full wallet configuration in production)'); }}
              className="w-full bg-[#00FFFF] text-black font-black py-4 uppercase tracking-widest hover:bg-white transition-colors">
              RECORD ON-CHAIN
            </button>
          </div>
        </aside>

        {/* CENTER: GAME GRID */}
        <section className="flex-1 bg-[#0a0a0a] border-y lg:border-x lg:border-y-0 border-[#333] relative flex justify-center p-2 sm:p-4 min-h-[400px] sm:min-h-[600px] touch-none"
           onTouchStart={handleTouchStart}
           onTouchEnd={handleTouchEnd}
        >
          {/* Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="w-full max-w-[320px] aspect-[10/20] border-2 border-[#333] relative bg-black/50 z-10 flex flex-col justify-center items-center overflow-hidden">
            {!gameState.isPlaying && !gameState.isGameOver && (
              <button onClick={startGame} className="text-[#00FFFF] animate-pulse text-2xl font-black uppercase z-20 absolute hover:scale-110 transition-transform">
                TAP TO START
              </button>
            )}
            {gameState.isGameOver && (
              <div className="flex flex-col items-center z-20 absolute bg-black/90 p-6 border-2 border-[#FF00FF] shadow-[0_0_30px_#FF00FF]">
                <h2 className="text-[#FF0000] text-3xl font-black mb-2 animate-bounce">GAME OVER</h2>
                <p className="text-white mb-6 uppercase tracking-widest text-sm">Score: <span className="text-[#00FFFF] font-mono">{gameState.score}</span></p>
                <button onClick={startGame} className="text-black font-bold uppercase tracking-widest bg-[#00FFFF] border border-[#00FFFF] px-6 py-3 hover:bg-white transition-colors">
                  PLAY AGAIN
                </button>
              </div>
            )}

            {/* Game Grid Drawing */}
            <div className="w-full h-full grid grid-cols-10 grid-rows-20 absolute inset-0">
              {Array.from({length: ROWS * COLS}).map((_, i) => {
                const x = i % COLS;
                const y = Math.floor(i / COLS);
                let color = 'transparent';
                let shadow = 'none';
                let isHead = false;

                const cell = grid[y]?.[x];
                if (cell) {
                  color = COLORS[cell.colorIndex];
                  shadow = `0 0 10px ${color}`;
                }

                if (piece && gameState.isPlaying) {
                  piece.shape.forEach((pt, idx) => {
                    if (piece.x + pt.x === x && piece.y + pt.y === y) {
                      color = COLORS[piece.colorIndex];
                      shadow = `0 0 15px ${color}`;
                      if (idx === 0) isHead = true;
                    }
                  });
                }

                if (food && food.x === x && food.y === y && gameState.isPlaying) {
                  color = '#FFFFFF';
                  shadow = `0 0 20px #FFFFFF`;
                }

                return (
                  <div key={i} className="border border-white/5 box-border" style={{
                    backgroundColor: color,
                    boxShadow: shadow,
                    opacity: color === 'transparent' ? 1 : (isHead ? 1 : 0.8)
                  }} />
                );
              })}
            </div>
          </div>

          <div className="absolute top-4 left-4 text-[10px] opacity-20 uppercase font-mono z-10 hidden sm:block pointer-events-none">
            System: v1.0.4-beta // bc_ktc2jlrn
          </div>
          {/* Mobile Controls Hint */}
          <div className="absolute bottom-4 text-[10px] opacity-40 uppercase font-mono z-10 sm:hidden pointer-events-none text-center w-full pb-2">
            Swipe to move • Swipe up to rotate
          </div>
        </section>

        {/* RIGHT SIDEBAR: LEADERBOARD */}
        <aside className="w-full lg:w-72 flex flex-col shrink-0">
          <div className="bg-[#111] p-4 border border-[#333] flex-1">
            <h3 className="text-xs uppercase font-bold tracking-[0.2em] mb-6 flex justify-between">
              <span>Top Legends</span>
              <span className="text-[#FF00FF] animate-pulse">Live</span>
            </h3>
            
            <div className="space-y-6">
              {[
                { name: 'vitalik.base.eth', score: '942,000 pts', badge: '1', style: 'from-[#00FFFF] to-[#FF00FF]' },
                { name: 'ox_snaker.base', score: '812,400 pts', badge: '2', style: 'from-[#333] to-[#444] opacity-80' },
                { name: 'basegod.eth', score: '745,200 pts', badge: '3', style: 'from-[#333] to-[#444] opacity-60' },
                { name: 'snaktris_fan.base', score: '620,100 pts', badge: '4', style: 'from-[#333] to-[#444] opacity-40' }
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${l.style} flex items-center justify-center font-bold ${i === 0 ? 'text-black' : 'text-white'} text-xs shrink-0`}>
                    {l.badge}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className={`text-sm font-bold truncate ${i > 0 ? 'opacity-80' : ''}`}>{l.name}</p>
                    <p className="text-[10px] opacity-50 uppercase">{l.score}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-4 border border-dashed border-[#444] rounded-lg">
              <p className="text-[10px] text-center opacity-50 uppercase leading-relaxed">
                Your Run is being recorded to <br/>
                <span className="text-[#39FF14]">ERC-8021 Transaction Pool</span>
              </p>
            </div>

            <div className="mt-6 block lg:hidden">
              <button 
                 onClick={() => { alert('Transaction simulated!'); }}
                 className="w-full bg-[#00FFFF] text-black font-black py-4 uppercase tracking-widest hover:bg-white transition-colors">
                RECORD ON-CHAIN
              </button>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER MARQUEE */}
      <footer className="h-12 border-t border-[#333] mt-6 flex items-center bg-[#0a0a0a] -mx-2 sm:-mx-6 px-2 sm:px-6 overflow-hidden shrink-0 fixed bottom-0 left-0 right-0 sm:relative z-20 pointer-events-none">
        <div className="whitespace-nowrap flex gap-12 text-[11px] font-mono tracking-tighter opacity-70 uppercase animate-marquee">
          <span>Builder Code: [bc_ktc2jlrn]</span>
          <span>Attribution: [ATTRIBUTION_CODE]</span>
          <span>Node Status: Connected</span>
          <span>Gas Price: 0.12 Gwei</span>
          <span>Network: Base L2</span>
          <span>Agent Protocol: ERC-8004 Active</span>
          <span>Sync: 100%</span>
          <span className="text-[#39FF14]">● All Systems Nominal</span>
          <span>Builder Code: [bc_ktc2jlrn]</span>
          <span>Attribution: [ATTRIBUTION_CODE]</span>
          <span>Node Status: Connected</span>
          <span>Gas Price: 0.12 Gwei</span>
          <span>Network: Base L2</span>
          <span>Agent Protocol: ERC-8004 Active</span>
          <span>Sync: 100%</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <GameInterface />
    </Web3Provider>
  );
}
