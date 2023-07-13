import React from 'react'

interface page{
    params:{item:string}
}
const page = ({params}:page) => {
  return (
    <div>
        <h1>Page Item {params.item}</h1>
    </div>
  )
}

export default page
