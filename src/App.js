// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// bootstrap css
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-loading-skeleton/dist/skeleton.css'
import './App.css';
import Header from "./components/common_components/Header";
import Footer from "./components/common_components/Footer";
import NoteList from "./components/NoteList"
import 'font-awesome/css/font-awesome.min.css';
import "react-datepicker/dist/react-datepicker.css";
function App() {
  return (
    <div >
     <Header/>
     <NoteList/>
     <Footer/>
    </div>
  );
}

export default App;
