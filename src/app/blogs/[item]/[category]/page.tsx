import React from 'react'

interface page{
    params:{category:string}
}
const page = ({params}:page) => {
  return (
    <div>
      <h1>Category {params.category}</h1>
    </div>
  )
}

export default page
