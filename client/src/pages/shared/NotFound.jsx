import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className='card-inset  my-12 mx-16 h-9/12 p-32 lg:my-24 lg:mx-32 text-left '>
      <h1 className='gradient-text text-feature-title '>404 - Page Not Found</h1>
        <p className='text-balance body-large m-12 ml-0 p-8 pl-0 w-full'>The page you're looking for doesn't exist.</p>
        <Link to="/" className='btn-primary  my-16'>Go Home</Link>

     
    </div>
  )
}