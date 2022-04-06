import React, { useEffect, useRef, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Item from './Item';

const View = () => {

    const listId = useParams().id
    const listName = useParams().name
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([])
    const [editId, setEditId] = useState(null)
    const nameRef = useRef()

    const getItems = () => {
        setLoading(true)
        fetch(`http://localhost:5000/api/v1/todos/${listId}/items`)
            .then(res => res.json())
            .then(json => {
                setItems(json.items)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        getItems()
    }, [])

    return (
        <div className='card'>
            <div style={{ display: 'flex', paddingTop: '10px', paddingBottom: '30px' }}>
                <Link to='/'><FiArrowLeft title='Back' style={{ fontSize: '20px' }} /></Link>
                <h4 style={{ margin: '0 auto', justifySelf: 'center' }}>{listName}</h4>
            </div>
            <div className='card-header'>
                <div className='input-container'>
                    <label htmlFor='item'>Item Name: </label>
                    <input type='text' name='item' ref={nameRef} placeholder='Enter item name' />
                </div>
                <button type="button" onClick={(e) => {
                    if (nameRef.current.value == '') {
                        alert('Item Name is required')
                        return
                    }
                    e.target.disabled = true
                    fetch('http://localhost:5000/api/v1/todos/create-item', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: editId, name: nameRef.current.value, listId })
                    })
                        .then(res => res.json())
                        .then(json => {
                            nameRef.current.value = ''
                            setEditId(null)
                            getItems()
                        })
                        .catch(err => {
                            console.log(err)
                        }).finally(() => {
                            e.target.disabled = false
                        })

                }}>{editId ? 'Save' : 'Add'}</button>
            </div>
            <div className='card-content'>
                {loading && <div className="loading-indicator"></div>}
                {(!loading && items.length > 0) && items.map((item, index) => {
                    return <Item item={item} key={index} onDelete={(id) => {
                        setItems((prevItems) => prevItems.filter(item => item.id != id))
                    }} onEdit={(item) => {
                        nameRef.current.value = item.name
                        setEditId(item.id)
                    }} onMarked={(id, status) => {
                        setItems((prevItems) => prevItems.map(item => {
                            if (item.id == id) {
                                item.status = status
                            }

                            return item

                        }))
                    }} />

                })}
                {(!loading && items.length == 0) && <p style={{ width: '100%', textAlign: 'center' }}>No item created for this list.</p>}

            </div>
        </div>
    )
}

export default View