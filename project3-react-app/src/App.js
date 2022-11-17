import logo from './logo.svg';
import './App.css';
import { ComponentContainer } from './components/ComponentContainer';
import { useData } from './utilities/useData';

const dataURL = "https://raw.githubusercontent.com/uic-vis/project-3-traffic-crashes-farah-nafiul/main/project3-react-app/src/data/filmdeathcounts.csv"
function App() {
  const deathCountData = useData({url: dataURL}) 

  console.log(deathCountData)
  return (
    <ComponentContainer />
  );
}

export default App;
