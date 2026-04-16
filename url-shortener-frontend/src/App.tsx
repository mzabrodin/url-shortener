import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Layout from './Layout'
import Home from './pages/Home'
import Stats from './pages/Stats'
import CodeStats from './pages/CodeStats'
import NotFound from './pages/NotFound'

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/stats" element={<Stats/>}/>
                    <Route path="/stats/:code" element={<CodeStats/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
