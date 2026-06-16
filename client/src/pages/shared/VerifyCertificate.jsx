import React from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {verifyCertificateSchema} from '../../../../shared/validators/certificateValidation'

const VerifyCertificate = () => {
  return (
    <div>
      <h1>Verify Certificate</h1>
      <p>Certificate verification page</p>
      <form>



      </form>
    </div>
  )
}

export default VerifyCertificate