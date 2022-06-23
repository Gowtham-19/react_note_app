import React, { useState, useEffect } from 'react'
import api_settings from "../settings/api_settings";
import { useStateWithCallbackLazy } from 'use-state-with-callback';
import http from "../interceptor";
import NoteCard from './NoteCard';
import { Row, Col, Button, Modal,ModalHeader, ModalBody, ModalFooter, Input, Card, CardHeader, CardBody, CardFooter } from "reactstrap"
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";

const NoteList = () => {
  //declerations part
  const max_date = new Date()
  const min_date = new Date().setFullYear(max_date.getFullYear() - 5)
  const [filterdate, setFilterDate] = useStateWithCallbackLazy(new Date());
  const [notes, setNotes] = useStateWithCallbackLazy([])
  const [isLoading, setisLoading] = useState(true)
  const [filtertype, setFilterType] = useStateWithCallbackLazy("display_all")
  const note_types = ["personal", "professional", "unimportant"]
  const date_filters = [
    { "display_name": "Display ALL Notes", "name": "display_all" },
    { "display_name": "Specific Day", "name": "specific_day" }, { "display_name": "Last 7 Days", "name": "last_week" },
    { "display_name": "Specific Month", "name": "specific_month" },
    { "display_name": "Specific Year", "name": "specific_year" },
  ]
  const [addnote, setAddNote] = useState(false);
  const [noteData, setNoteData] = useState({
    category: "",
    subject: "",
    content: ""
  })

  //initial page load api call
  useEffect(() => {
    getNotes()
  }, []);

  /**apis part */
  const getNotes = async () => {
    await http.get(api_settings.GET_ALL_NOTES).then(res => {
      res = res["data"] ? res["data"] : []
      console.log("data came in service", res)
      setNotes(res["data"])
      setisLoading(false)
    }).catch(err => {
      setisLoading(false)
    })
  }

  const addNote = async (event) => {
    event.preventDefault()
    await http.post(api_settings.CREATE_NOTE, {
      "subject": noteData.subject,
      "content_type": noteData.category,
      "description": noteData.content
    }).then(res => {
      // console.log("data inserted")
      toast("Note is Added", { type: 'success' })
      setAddNote(false)
      setisLoading(true)
      getNotes()
    })
    // console.log("data of notes object", noteData)
  }

  const deleteNote = async (id) => {
    await http.get(api_settings.DELETE_NOTE + "/" + id).then(res => {
      get_notes_data()
    }).catch(err => {

    })
  }

  /**end of apis part */

  const setFilterTypeValue = (event) => {
    setFilterType(event.target.value, () => {
      console.log("value of filter type value",filtertype)
      setFilter(new Date(),event.target.value)
    })
  }


  const setAddNoteValues = (event) => {
    const { name, value } = event.target;
    setNoteData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const resetForm = () => {
    setAddNote(false)
    setNoteData({
      category: "",
      subject: "",
      content: ""
    })
  }

  const get_notes_data = () => {
    getNotes()
  }

  const delete_note_data = (id) => {
    deleteNote(id)
  }

  const setFilter = (date,filter) => {
    // console.log("value of filter type----",filter_type)
    setisLoading(true)
    let filter_type_val=null
    if(filter !== undefined){
      filter_type_val = filter
    }else{
      filter_type_val = filtertype
    }
    console.log("value of filter type all",filter_type_val)
    setFilterDate(date, () => {
      let body={
        // filter_type
      }
      if(filter_type_val === "specific_day"){
        body={
          filter_type:"specific_day",
          date:date.getDate(),
          month:date.getMonth()+1,
          year:date.getFullYear()
        }
      }else if(filter_type_val === "specific_month"){
        body={
          filter_type:"specific_month",
          month:date.getMonth()+1,
          year:date.getFullYear()
        }
      }else if(filter_type_val === "specific_year"){
        body={
          filter_type:"specific_year",
          year:date.getFullYear()
        }
      }else if(filter_type_val === "last_week"){
        body={
          filter_type:"last_week"
        }
      }else if(filter_type_val==="display_all"){
        body={
          filter_type:"get_all_notes"
        }
      }
      http.post(api_settings.FILTER_NOTE, {
      ...body
      }).then(res => {
        let data = res["data"]
        console.log("data of filtered results",data)
        if(data["data"] && data["data"].length>0){
          setNotes(data["data"],() => {
            console.log("filter date is update",notes)
            setisLoading(false)
          })
        }else{
          setNotes([],() => {
            console.log("filter date is update")
            setisLoading(false)
          })
        }
      })
      // console.log("value of filtertype",filtertype)
      console.log("value of date selected:", body)
    })
  }

 
  return (
    <div>
      <Row md={12} className="filters">
        <Col md={3}>
          <label><b>Select Date Filter:</b></label>
          <select className='form-control' defaultValue={filtertype} onChange={setFilterTypeValue} name="filtertype" id="filtertype">
            <option disabled value="DEFAULT">select filter type</option>
            {date_filters.map((filter, i) => {
              return <option key={i} name="filtertype{i}" id="filtertype{i}" value={filter.name}>{filter.display_name}</option>
            })}
          </select>
        </Col>
        <Col md={3}>
          {
            (filtertype === "specific_day") ? (
              <>
              <label><b>Select Specific Day</b></label>
              <DatePicker
                className='form-control'
                selected={filterdate}
                onChange={(date) => setFilter(date,undefined)}
                minDate={min_date}
                maxDate={max_date}
                dateFormat="dd/MM/yyyy" disabled={filtertype === "display_all"}
              />
              </>
            ) : (
              (filtertype === "specific_month") ? (
                <>
                <label><b>Select Specific Month</b></label>
                <DatePicker
                  className='form-control'
                  showMonthYearPicker
                  selected={filterdate}
                  onChange={(date) => setFilter(date,undefined)}
                  minDate={min_date}
                  maxDate={max_date}
                  dateFormat="MMMM" disabled={filtertype === "display_all"} />
                </>
              ) : (
                (filtertype === "specific_year") ? (
                  <>
                  <label><b>Select Specific Year</b></label>
                  <DatePicker
                    className='form-control'
                    showYearPicker
                    selected={filterdate}
                    onChange={(date) => setFilter(date,undefined)}
                    minDate={min_date}
                    maxDate={max_date}
                    dateFormat="yyyy" disabled={filtertype === "display_all"} />
                  </>
                ) : (<div></div>)
              )
            )
          }
        </Col>
        <Col md={4}>
          <Button className='btn btn-success mt-2' onClick={() => {
            setAddNote(true)
          }} >Add New Note</Button>
        </Col>
      </Row>
      <ToastContainer position='top-center' theme="colored" />
      <Modal isOpen={addnote} backdrop="static" style={{ "color": "black" }}>
        <ModalHeader toggle={() => {
          setAddNote(false)
        }}>
          <span style={{"color":"green"}}>Add Note</span>
          </ModalHeader>
        <ModalBody>
          <div className='form-group mb-3'>
            <Row>
              <Col md={6}>
                <label><b>Select Note Type:</b></label>
                <select className='form-control' defaultValue={'DEFAULT'} onChange={setAddNoteValues} name="category" id="category">
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
            <span style={{ "float": "right" }}> <span style={ noteData.subject && noteData.subject.length <= 25 ? { "color": "green" } : { "color": "red" }}>{noteData.subject?noteData.subject.length:0}</span>/<b>25</b></span>
            {noteData.subject && noteData.subject.length > 25 ? (
              <span className='text-danger'>Maximum characters limit is excceded</span>
            ) : (
              <></>
            )}
          </div>
          <div className='form-group'>
            <label><b>Description(allowed only 160 characters)</b></label>
            <Input type="textarea" rows="7" name="content" id="content" placeholder='you can write in detail about your note'
              onChange={setAddNoteValues} value={noteData.content} autoComplete="off" className='form-control' />
            <span style={{ "float": "right" }}> <span style={noteData.content && noteData.content.length <= 160 ? { "color": "green" } : { "color": "red" }}>{noteData.content?noteData.content.length:0}</span>/<b>160</b></span>
            {noteData.content && noteData.content.length > 160 ? (
              <span className='text-danger'>Maximum characters limit is excceded</span>
            ) : (
              <></>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={addNote} disabled={noteData.category && noteData.subject && noteData.subject.length <= 25 && noteData.content && noteData.content.length <= 160 ? false : true}>Submit</Button>
          <Button color="secondary" onClick={resetForm}>Close</Button>
        </ModalFooter>
      </Modal>
      {!isLoading ? (
        <>
          <div className='d-flex flex-row card-list'>
            <Row>
              {notes.map((note, i) =>
                <Col key={i} >
                  <NoteCard note={note} get_notes_data={get_notes_data} delete_note_data={delete_note_data} />
                </Col>
              )}
            </Row>
          </div>
        </>
      ) :
        <div>
          {isLoading ? (
            <div className='d-flex flex-row card-list'>
              <Row>
                <Card className='card-body-loader'>
                  <CardHeader>
                    <Skeleton />
                  </CardHeader>
                  <CardBody>
                    <Skeleton count={5} />
                  </CardBody>
                  <CardFooter>
                    <Skeleton />
                  </CardFooter>
                </Card>
                <Card className='card-body-loader'>
                  <CardHeader>
                    <Skeleton />
                  </CardHeader>
                  <CardBody>
                    <Skeleton count={5} />
                  </CardBody>
                  <CardFooter>
                    <Skeleton />
                  </CardFooter>
                </Card>
                <Card className='card-body-loader'>
                  <CardHeader>
                    <Skeleton />
                  </CardHeader>
                  <CardBody>
                    <Skeleton count={5} />
                  </CardBody>
                  <CardFooter>
                    <Skeleton />
                  </CardFooter>
                </Card>
              </Row>
            </div>
          ) : (
            <h3>No Data</h3>
          )}

        </div>
      }

    </div>
  )
}

export default NoteList