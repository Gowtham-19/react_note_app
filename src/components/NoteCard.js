import React, { useState } from 'react'
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import api_settings from "../settings/api_settings";
import { Card, CardBody, CardHeader, CardFooter, CardTitle, Button,Modal,ModalFooter,ModalHeader,ModalBody,Row,Col,Input } from "reactstrap"
import { ToastContainer, toast } from 'react-toastify';
import http from "../interceptor";
const NoteCard = ({ note,get_notes_data,delete_note_data }) => {
  const note_types = ["personal", "professional", "unimportant"]
  const [addnote, setAddNote] = useState(false);
  const[deletepopup,setDeletePopup] = useState(false);
  const [noteData, setNoteData] = useStateWithCallbackLazy({
    id: "",
    category: "",
    subject: "",
    content: ""
  })
  
  const updateNote = async (event) => {
    event.preventDefault()
    await http.put(api_settings.UPDATE_NOTE, { 
      "_id":noteData.id,
      "subject": noteData.subject,
      "content_type": noteData.category,
      "description": noteData.content}).then(res => {
      console.log("data inserted")
      toast("Note is Updated",{type:'success'})
      setAddNote(false)
      get_notes_data()
    })
    console.log("data of notes object", noteData)
  }

  const deleteData = () => {
    console.log("delete called")
    delete_note_data(note._id)
  }

  /**end of apis part */


  const setAddNoteValues = (event) => {
    const { name, value } = event.target;
    setNoteData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const editNoteData = () => {
    setNoteData({ id: note._id, subject: note.subject, category: note.content_type, content: note.description },() => {
      console.log("fubction incard called",noteData)
      console.log("fubction incard called",note)
      setAddNote(true)
    })
  }
  return (
    <>
    <Card className='card-body'>

      <CardHeader><b>{note.content_type?.toUpperCase()}</b>
        <span style={{ "float": "right" }}><b>created on:</b> {`${note.created_date}-${note.created_month}-${note.created_year}`}</span>
      </CardHeader>
      <CardBody>
        <CardTitle><b>subject</b>:{note.subject}</CardTitle>
        {/* <CardText><b>about: </b>{note.description}</CardText> */}
        <p className="card-text d-inline-block">
          {note.description}
        </p>
      </CardBody>
      <CardFooter className='d-flex justify-content-end'>
        <Button color="primary" onClick={editNoteData}>Edit</Button>&nbsp;&nbsp;&nbsp;
        <Button color='danger' onClick={() => {setDeletePopup(true)}}>Delete</Button>
      </CardFooter>
    </Card>
    <ToastContainer position='top-center' theme="colored"/>
      <Modal isOpen={addnote} backdrop="static" style={{ "color": "black" }}>
        <ModalHeader toggle={() => {
          setAddNote(false)
        }}>
          <span style={{"color":"blue"}}>Edit Note</span>
          </ModalHeader>
        <ModalBody>
          <div className='form-group mb-3'>
            <Row>
              <Col md={6}>
                <label><b>Select Note Type:</b></label>
                <select className='form-control' defaultValue={noteData.category} onChange={setAddNoteValues} name="category" id="category">
                  <option disabled value="DEFAULT">select type</option>
                  {note_types.map((type, i) => {
                    return <option key={i} name="category{i}" id="category{i}" value={type}>{type}</option>
                  })}
                </select>
              </Col>
            </Row>
          </div>
          <div className='form-group mb-3'>
            <label><b>Note Subject(allowed only 25 characters)</b></label>
            <Input type='textarea' rows="2" name="subject" id="subject" placeholder='enter subject eg:need to do project'
              onChange={setAddNoteValues} value={noteData.subject} autoComplete="off" className='form-control' />
            <span style={{ "float": "right" }}> <span style={noteData.subject.length <= 25 ? { "color": "green" } : { "color": "red" }}>{noteData.subject.length}</span>/<b>25</b></span>
            {noteData.subject.length > 25 ? (
              <span className='text-danger'>Maximum characters limit is excceded</span>
            ) : (
              <></>
            )}
          </div>
          <div className='form-group'>
            <label><b>Description(allowed only 160 characters)</b></label>
            <Input type="textarea" rows="7" name="content" id="content" placeholder='you can write in detail about your note'
              onChange={setAddNoteValues} value={noteData.content} autoComplete="off" className='form-control' />
            <span style={{ "float": "right" }}> <span style={noteData.content.length <= 160 ? { "color": "green" } : { "color": "red" }}>{noteData.content.length}</span>/<b>160</b></span>
            {noteData.content.length > 160 ? (
              <span className='text-danger'>Maximum characters limit is excceded</span>
            ) : (
              <></>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={updateNote} disabled={noteData.category && noteData.subject && noteData.subject.length <= 25 && noteData.content && noteData.content.length <= 160 ? false : true}>Update</Button>
          <Button color="secondary" onClick={() => {
              setAddNote(false)
          }}>Close</Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={deletepopup} backdrop="static" style={{ "color": "black" }}
      centered
      >
        <ModalHeader toggle={() => {
          setDeletePopup(false)
        }}>
          <span style={{"color":"red"}}>
          Delete Note
          </span>
          </ModalHeader>
        <ModalBody>
          <div className='form-group'>
              <b>Are you sure to delete your note!Please Confirm</b>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={deleteData}>Confirm</Button>
          <Button color="secondary" onClick={() => {
               setDeletePopup(false)
          }}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default NoteCard;