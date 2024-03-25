'use client'
import React, { useState } from 'react';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import sendEmail from '@/utils/sendEmail.mjs';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const EmailForm = () => {
    const [emailFrom, setEmailFrom] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [htmlMessage, setHtmlMessage] = useState('');

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, 
            {'indent': '-1'}, {'indent': '+1'}],
            ['link',],
            ['clean'],
            [{ 'color': [] }, { 'background': [] }], // Text and background color options
        ],
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await sendEmail(email, subject, htmlMessage, emailFrom);
            toast.success('Email sent successfully!')
            setEmail('');
            setSubject('');
            setHtmlMessage('');
            setEmailFrom('');
        } catch (error) {
            toast.error("Error sending email. Check domain and try again.")
        }
    };

    return (
        <form onSubmit={handleSubmit} className='cardinhome'>
            <div className="form-control">
                <label htmlFor="emailFrom" className="label">
                    <span className="label-text">Email From</span>
                </label>
                <input
                    type="email"
                    id="emailFrom"
                    placeholder="ex: hasan@f.ruqyahbd.org you can only change the hasan part here."
                    className="input input-bordered focus:outline-none"
                    value={emailFrom}
                    onChange={(e) => setEmailFrom(e.target.value)}
                    required
                />
            </div>

            <div className="form-control">
                <label htmlFor="email" className="label">
                    <span className="label-text">Email To</span>
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter recipient's email"
                    className="input input-bordered focus:outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-control">
                <label htmlFor="subject" className="label">
                    <span className="label-text">Subject</span>
                </label>
                <input
                    type="text"
                    id="subject"
                    placeholder="Enter subject"
                    className="input input-bordered focus:outline-none"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>

            <div className="form-control">
                <label htmlFor="message" className="label">
                    <span className="label-text">Message</span>
                </label>
                <ReactQuill
                    value={htmlMessage}
                    className='dark:bg-black'
                    theme="snow"
                    modules={modules} // Pass the customized toolbar options
                    onChange={setHtmlMessage}
                    placeholder="Compose your message..."
                />
            </div>

            <button type="submit" className="btn-green btn-green-active">
                Send Email
            </button>
        </form>
    );
};

export default EmailForm;
