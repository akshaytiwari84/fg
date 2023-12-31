import React, { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import FlashCardSchema from "../validations/schema/CardSchema";
import { ToastContainer, toast } from 'react-toastify';

import { nanoid } from "nanoid";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

import { useDispatch } from "react-redux";
import { setFlashCard } from "../app/features/flashcardSlice";

import 'react-toastify/dist/ReactToastify.css';

const CreateFlashCard = (props) => {
  const dispatch = useDispatch();
  const filePickerRef = useRef(null);
  const editRef = useRef([]);
  const [groupimg, setGroupimg] = useState("");

  const notify = () => {
    toast("Flashcard Created Successfully.....");
  }

  const addFlashCard = (values, actions) => {
    dispatch(setFlashCard(values));
    actions.resetForm();
    setGroupimg("");
    notify();
  };
  const handleInputFocus = (index) => {
    editRef?.current[index].focus()
  }

  return (
    <Formik
      // This sets the Initial Values of form input for the Formik, which wil afer being change according to the user Input
      initialValues={{
        groupid: nanoid(),
        groupname: "",
        groupdescription: "",
        groupimg: "",
        cards: [
          {
            cardid: nanoid(),
            cardname: "",
            carddescription: "",
          },
        ],
        createOn: new Date(Date.now()).toLocaleString(),
      }}
      validationSchema={FlashCardSchema}
      onSubmit={addFlashCard}
    >
      {({ values, isSubmitting, setFieldValue }) => (
        <Form className="w-full space-y-5 text-slate-500 font-medium">
          <div className="flex flex-col px-10 py-4 bg-white drop-shadow-lg space-y-4 rounded-md">
            {/* upper */}
            <div className="flex flex-col sm:flex-row items-center space-x-10 pt-3">
              {/* left */}
              <div className="flex flex-col relative">
                <h2>Create Group</h2>
                <Field
                  type="text"
                  id="createGroup"
                  name="groupname"
                  className="border-slate-300 md:w-96 border-2 rounded-sm focus:ring-slate-400 focus:border focus:border-slate-400"
                />
                <span className="absolute left-[7rem] text-lg font-medium">
                  *
                </span>
                <ErrorMessage
                  component={"div"}
                  className="text-sm text-red-500"
                  name="groupname"
                />
                {/* <span onClick={() => {setGroupimg(''); }} ></span> */}
              </div>
              {/* right */}
              {groupimg ? (
                <img className="w-28 h-28 object-contain" src={groupimg} alt="groupimg"></img>

              ) : (
                <button
                  type="button"
                  onClick={() => filePickerRef.current.click()}
                  className={`flex items-center px-5 py-2 mt-6 bg-white border-2 border-slate-300 active:border-blue-600 text-blue-700 font-semibold rounded-md space-x-2`}
                >
                  <UploadOutlined />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    ref={filePickerRef}
                    value={groupimg}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);

                      reader.onload = () => {
                        setFieldValue("groupimg", reader.result);
                        setGroupimg(reader.result);
                      };
                    }}
                    hidden
                  />
                </button>
              )}
            </div>
            {/* down */}
            <div className="flex flex-col w-full sm:w-[70%]">
              <h2 className="mb-2">Add Description</h2>
              <Field
                as="textarea"
                id="addDescription"
                name="groupdescription"
                rows={3}
                placeholder="Describe the roles, responsibilities, skills required for the job and help candidate understand the role better"
                className="resize-none border-slate-300 border-2 rounded-sm placeholder:opacity-40 focus:ring-slate-400 focus:border focus:border-slate-400"
              />
              <ErrorMessage
                component={"div"}
                className="text-sm text-red-500"
                name="groupdescription"
              />
            </div>
          </div>

          {/* ------------------------- */}

          {/* Add Cards Section  */}
          <div className="text-black drop-shadow-lg rounded-lg">
            {/* FieldArray component from Formik which will create Dynamic Form for the custom input */}

            <FieldArray name="cards">
              {(arrayHelper) => {
                const cards = values.cards;
                return (
                  <>
                    {cards && cards.length > 0
                      ? cards.map((Cards, index) => (
                        <div
                          className="flex items-center space-x-10 bg-white px-5 lg:px-10 py-4"
                          key={index}
                        >
                          <div className="p-2 w-10 h-10 flex items-center justify-center bg-red-600 text-white text-md font-semibold rounded-full">
                            {index + 1}
                          </div>
                          <div className="flex flex-col space-y-3 md:space-x-10 md:flex-row">
                            <div className="relative flex flex-col justify-center space-y-3">
                              <h2 className="">Enter Term</h2>
                              <Field
                                type="text"
                                id="enterTerm"
                                name={`cards.${index}.cardname`}
                                innerRef={(ref) => editRef.current[index] = ref}
                              />
                              <span className="absolute left-[5.8rem] -top-[15px] md:top-0 text-lg font-medium">
                                *
                              </span>
                              <ErrorMessage
                                component={"div"}
                                className="text-sm text-red-500"
                                name={`cards.${index}.cardname`}
                              />
                            </div>
                            <div className="relative flex flex-col justify-center space-y-3">
                              <h2 className="">Enter Defination</h2>
                              <Field
                                as="textarea"
                                id="enterDefination"
                                name={`cards.${index}.carddescription`}
                                className="resize-none lg:w-72"
                              />
                              <span className="absolute left-[8.5rem] -top-[1rem] text-lg font-medium">
                                *
                              </span>
                              <ErrorMessage
                                component={"div"}
                                className="text-sm text-red-500"
                                name={`cards.${index}.carddescription`}
                              />
                            </div>

                            <div className="flex items-center space-x-2">

                              <div className="flex items-center justify-around w-full md:flex-col md:space-y-5 md:mt-5">
                                <button
                                  type="button"
                                  onClick={() => arrayHelper.remove(index)}
                                >
                                  <TrashIcon className="h-6 text-slate-500" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleInputFocus(index)}
                                >
                                  <PencilAltIcon className="h-6 text-blue-600" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                      : null}
                    <button
                      type="button"
                      onClick={() =>
                        //  This button will add the new group of inputs to the dynamic form
                        arrayHelper.push({
                          cardid: nanoid(),
                          cardname: "",
                          carddescription: "",
                        })
                      }
                      className="flex items-center space-x-2 text-blue-600 font-medium text-sm bg-white w-full mb-5 px-5 py-2"
                    >
                      <PlusOutlined />
                      <span>Add More</span>
                    </button>
                    <div className="flex justify-center w-full">
                      <button
                        disabled={isSubmitting}
                        type="submit"
                        className="py-2 px-6  bg-red-600 text-white rounded-md"
                      >
                        Create
                      </button>
                    </div>
                  </>
                );
              }}
            </FieldArray>
          </div>
          <ToastContainer />
        </Form>
      )}

    </Formik>
  );
};

export default CreateFlashCard;