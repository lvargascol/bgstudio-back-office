import { useState, useEffect } from 'react';
import axios from 'axios';
import useAlert from '@hooks/useAlert';
import endPoints from '@services/api';
import Modal from '@common/Modal';
import Alert from '@common/Alert';
import AddUser from '@components/AddUser';
import EditUser from '@components/EditUser';
export default function Team() {
  const [users, setUsers] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [id, setId] = useState(null);
  const { alert, setAlert, toggleAlert } = useAlert();
  useEffect(() => {
    async function loadUsers() {
      const response = await axios.get(endPoints.users.getAllUser);
      setUsers(response.data);
    }
    try {
      loadUsers();
    } catch (error) {
      console.log(error);
    }
  }, [alert]);

  const handleEdit = (id) => {
    setId(id);
    setOpenEdit(true);
  };
  return (
    <ul className="divide-y divide-gray-200">
      <Alert alert={alert} handleClose={toggleAlert} />
      {users.map((user) => (
        <li key={`user-${user.id}`} className="py-2 px-2">
          <div className="flex justify-between gap-x-6">
            <div className="flex gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-5 text-gray-900">{user.email}</p>
                <p className="mt-1 truncate text-xs leading-3 text-gray-500">{user.role}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button type="button" className="flex gap-x-2 ring-1 ring-blue-900 my-2 rounded" onClick={() => handleEdit(user.id)}>
                <span className="text-xs leading-5 text-blue-900 py-1 px-2">Editar</span>
              </button>
            </div>
          </div>
        </li>
      ))}
      <li className="py-4 px-2">
        <button type="button" className="flex gap-x-2" onClick={() => setOpenAdd(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 fill-gray-600	">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
          </svg>
          <span className="text-sm leading-4 text-gray-600">Añadir nuevo miembro</span>
        </button>
      </li>
      <Modal open={openEdit} setOpen={setOpenEdit}>
        <EditUser setOpen={setOpenEdit} setAlert={setAlert} id={id} />
      </Modal>
      <Modal open={openAdd} setOpen={setOpenAdd}>
        <AddUser setOpen={setOpenAdd} setAlert={setAlert} />
      </Modal>
    </ul>
  );
}
