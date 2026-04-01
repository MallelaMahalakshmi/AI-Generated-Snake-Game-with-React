/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] overflow-hidden relative font-digital uppercase selection:bg-[#f0f] selection:text-black">
      {/* Static Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-static" />
      
      {/* Screen Tear Container */}
      <div className="screen-tear relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center gap-12 xl:flex-row xl:items-start xl:justify-between">
        
        {/* Header / Title & Player */}
        <div className="w-full xl:w-1/3 flex flex-col items-center xl:items-start space-y-8">
          <div className="text-center xl:text-left border-l-8 border-[#f0f] pl-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#0ff] glitch-text" data-text="SYS.OP_SNAKE">
              SYS.OP_SNAKE
            </h1>
            <h2 className="text-2xl md:text-3xl text-black bg-[#0ff] tracking-widest mt-2 inline-block px-3 py-1 shadow-[4px_4px_0px_#f0f]">
              AUDIO_SUBSYSTEM_ACTIVE
            </h2>
          </div>
          
          <div className="w-full flex justify-center xl:justify-start">
            <MusicPlayer />
          </div>
        </div>

        {/* Game Area */}
        <div className="flex-1 flex justify-center items-center w-full">
          <SnakeGame />
        </div>

      </div>
    </div>
  );
}
