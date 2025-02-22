import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/send" element={<SendMoneyModal />} /> */}
      </Routes>
    </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
