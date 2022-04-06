import React, { useEffect, useRef, useState } from 'react'
import List from './List'

const Todos = () => {

  const [loading, setLoading] = useState(false)
  const [lists, setLists] = useState([])
  const [editId, setEditId] = useState(null)
  const dateRef = useRef()
  const nameRef = useRef()

  const getLists = () => {
    setLoading(true)
    fetch('http://localhost:5000/api/v1/todos/lists')
      .then(res => res.json())
      .then(json => {
        setLists(json.lists)
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    getLists()
  }, [])

  return (
    <div className='card'>
      <div className='card-header'>
        <div className='date-container'>
          <label htmlFor='date'>Date: </label>
          <input type='date' name='date' ref={dateRef} />
        </div>
        <div className='input-container'>
          <label htmlFor='list'>List Name: </label>
          <input type='text' name='list' ref={nameRef} placeholder='Enter list name' />
        </div>
        <button type="button" onClick={(e) => {

          if (dateRef.current.value == '' || nameRef.current.value == '') {
            alert('Date and List Name are required')
            return
          }
          e.target.disabled = true
          fetch('http://localhost:5000/api/v1/todos/create-list', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: editId, name: nameRef.current.value, date: dateRef.current.value })
          })
            .then(res => res.json())
            .then(json => {
              nameRef.current.value = ''
              dateRef.current.value = ''
              setEditId(null)
              getLists()
            })
            .catch(err => {
              console.log(err)
            }).finally(() => {
              e.target.disabled = false
            })

        }}>{editId ? 'Save' : 'Create'}</button>
      </div>
      <div className='card-content'>
        {loading && <div className="loading-indicator"></div>}
        {(!loading && lists.length > 0) && lists.map((list, index) => {
          return <List list={list} key={index} onDelete={(id) => {
            setLists((prevLists) => prevLists.filter(list => list.id != id))
          }} onEdit={(item) => {
            dateRef.current.value = item.date
            nameRef.current.value = item.name
            setEditId(item.id)
          }} />

        })}
        {(!loading && lists.length == 0) && <p style={{ width: '100%', textAlign: 'center' }}>No todo list created yet.</p>}

      </div>
    </div>
  )
}

export default Todos