import { Link } from 'react-router'
import { FaArrowRightLong } from "react-icons/fa6";
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container ">
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} alt="limlydraw - website logo" className='w-100 h-100'/>
            <h1 className='text-logo'>LimlyDraw</h1>
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <Link 
              to="/login"
              className='text-white bg-btn text-decoration-none px-4 py-2 rounded fs-18 d-flex align-items-center justify-content-center gap-2
                  fw-semibold '
            >
              Get Started
               <FaArrowRightLong className='fs-6' />
            </Link>
          </div>
        </div>
      </nav>

    </>
  )
}

export default Navbar