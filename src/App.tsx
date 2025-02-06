import './App.css'
import DonneeMeteo from './components/DonneeMeteo';

function App() {

  return (
    <div className='bg-slate-900 min-h-screen flex flex-col justify-center items-center'>
     <h2 className='text-center text-slate-200 text-5xl font-doto font-semibold'>Méteo</h2>
     <div className='text-slate-200 font-doto font-semibold text-xl'>
<DonneeMeteo/>
     </div>
    </div>
  )
}

export default App
