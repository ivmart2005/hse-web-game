import { useGameScale, useCamera } from './hooks';
import { GameProvider } from './contexts/GameContext';
import Character from './components/Character/Character';
import Background from './components/Background/Background';
import './App.css';

function App() {
  const { scale, containerRef } = useGameScale();
  const { zoom } = useCamera();
  const combinedScale = scale * zoom;

  return (
    <GameProvider>
      <div className="App">
        <div ref={containerRef} className="game-container">
          <div className={`game-world scale-${Math.round(combinedScale * 100)}`}>
            <Background />
            <Character />
          </div>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;