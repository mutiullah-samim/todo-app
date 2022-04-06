import React from 'react'
import { FiTrash, FiEdit, FiCheckCircle } from "react-icons/fi";

const Item = ({ item, onDelete, onEdit, onMarked }) => {

    return (
        <div className={'todo-item' + (item.status == 1 ? ' done' : '')}>
            <div className='item-name'>{item.name}</div>
            <div className='actions' >
                <FiCheckCircle className={'btn' + (item.status == 1 ? ' done' : '')} title={'Mark ' + (item.status == 0 ? 'Done' : 'Undone')} onClick={() => {
                    fetch('http://localhost:5000/api/v1/todos/mark-item', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: item.id, status: item.status == 0 ? 1 : 0 })
                    })
                        .then(res => res.json())
                        .then(json => {
                            onMarked(item.id, item.status == 0 ? 1 : 0)
                        })
                        .catch(err => {
                            console.log(err)
                        })

                }} />
                <FiTrash className='btn' title='Delete' onClick={() => {
                    fetch('http://localhost:5000/api/v1/todos/delete-item', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: item.id })
                    })
                        .then(res => res.json())
                        .then(json => {
                            onDelete(item.id)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }} />
                <FiEdit className='btn' title='Edit' onClick={() => { onEdit(item) }} />
            </div>
        </div>
    )
}

export default Item