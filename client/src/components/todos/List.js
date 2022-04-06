import React from 'react'
import { Link } from 'react-router-dom'
import { FiEye, FiTrash, FiEdit } from "react-icons/fi";


const List = ({ list, onDelete, onEdit }) => {

    return (
        <div className='todo-list'>
            <div>
                <div className='list-name'>{list.name}</div>
                <div className='list-date'>{list.date}</div>
            </div>
            <div>
                <div>
                    <span>Items: </span>
                    <div className='items-count'>{list.items}</div>
                </div>
                <div className='actions'>
                    <FiTrash className='btn' title='Delete' onClick={() => {
                        fetch('http://localhost:5000/api/v1/todos/delete-list', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: list.id })
                        })
                            .then(res => res.json())
                            .then(json => {
                                onDelete(list.id)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }} />
                    <FiEdit className='btn' title='Edit' onClick={() => { onEdit(list) }} />
                    <Link to={`/${list.id}/${list.name}`}><FiEye className='btn view-list' title='View' /></Link>
                </div>
            </div>
        </div>
    )
}


export default List