import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import { routes, routeArray } from './config/routes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routeArray.map((route) => (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<route.component />} 
            />
          ))}
          <Route index element={<routes.home.component />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          background: '#1A1125',
          color: '#D4AF37',
          border: '1px solid #8B5A8C'
        }}
        className="z-[9999]"
      />
    </BrowserRouter>
  );
}

export default App;