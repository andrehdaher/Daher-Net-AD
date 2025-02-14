import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login'
import Singup from './pages/Singup'
import Home from './pages/Home'
import Search from './pages/Search'
import Adduser from './pages/Adduser'
import Update from './pages/Update'
import Userdahboard from './pages/Userdashboard'
import Inventory from './pages/Inventory'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem ';
import Sales from './pages/Sales';
import EditSale from './pages/EditSale ';
import AddPassport from './pages/AddPassport';
import Passports from './pages/ViewPassports';
import EditPassport from './pages/EditPassport';


const App = () => {
  return (
    <div>
      
      <Router>
      <Routes>
      
        <Route  path='/'  element={<Home/>}/>
        <Route  path='/login'  element={<Login/>}/>
        <Route  path='/singup'  element={<Singup/>}/>
        <Route  path='/search'  element={<Search/>}/>
        <Route  path="/add-user"  element={<Adduser/>}/>
        <Route  path='/update'  element={<Update/>}/>
        <Route  path='/inventory'  element={<Inventory/>}/>
        <Route  path='/add-item'  element={<AddItem/>}/>
        <Route  path='/user-dashboard'  element={<Userdahboard/>}/>
        <Route  path='/edit-item/:id'  element={<EditItem/>}/>
        <Route path="/sales" element={<Sales />}/>
        <Route path="/edit-sale/:id" element={<EditSale />} />
        <Route path="/add-passport" element={<AddPassport />} />
        <Route path="/passports" element={<Passports />} />
        <Route path="/edit-passport/:id" element={<EditPassport />} />
  
      </Routes>
      </Router>


    </div>
  )
}

export default App
