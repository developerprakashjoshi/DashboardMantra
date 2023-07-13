import * as Yup from 'yup'
export const roleSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required').min(5, 'Description too short!'),
})