import React from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import { useState } from 'react'
import '../App.css'
import { useForm } from "react-hook-form"
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RegForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const [captchaValue, setCaptchaValue] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCaptchaChange = (value) => {
        setCaptchaValue(value)
    }

    const inputClasses = (error) =>
        `form-control ${error ? 'border-danger' : ''}`;

    const selectClasses = (error) =>
        `form-select ${error ? 'border-danger' : ''}`;

    const onSubmit = async (data) => {
        setIsSubmitting(true)
        const imageFile = data.image[0];
        const formDataToSend = new FormData()

        formDataToSend.append('country', data.country)
        formDataToSend.append('city', data.city)
        formDataToSend.append('course', data.course)
        formDataToSend.append('proficiency', data.proficiency)
        formDataToSend.append('fullName', data.fullName)
        formDataToSend.append('fatherName', data.fatherName)
        formDataToSend.append('email', data.email)
        formDataToSend.append('cnic', data.cnic)
        formDataToSend.append('phone', data.phone)
        formDataToSend.append('fatherCnic', data.fatherCnic)
        formDataToSend.append('dob', data.dob)
        formDataToSend.append('gender', data.gender)
        formDataToSend.append('qualification', data.qualification)
        formDataToSend.append('hasLaptop', data.hasLaptop)
        formDataToSend.append('image', imageFile)

        try {
            const response = await axios.post('http://localhost:5000/api/user/create', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);

            if (response.data.success) {
                toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                reset();
                setCaptchaValue(null);
            } else {
                toast.error(response.data.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            console.error("Axios error:", error);
            toast.error("Something went wrong. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div className="w-full bg-white px-2 sm:px-4 md:px-6 lg:px-8 py-4">
            <ToastContainer />
            <div className="max-w-[1000px] mx-auto">
                <Container fluid>
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Select Country</Form.Label>
                                <Form.Select
                                    aria-label="Select Country"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("country", { required: "Country is required" })}
                                >
                                    <option value="">Select country</option>
                                    <option value="pakistan">Pakistan</option>
                                    <option value="turkey">Turkey</option>
                                </Form.Select>
                                {errors.country && (
                                    <Form.Text className="text-danger">
                                        {errors.country.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Select City</Form.Label>
                                <Form.Select
                                    aria-label="Select City"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("city", { required: "City is required" })}
                                >
                                    <option value="">Select city</option>
                                    <option value="Karachi">Karachi</option>
                                    <option value="Faislaabad">Faislaabad</option>
                                    <option value="Rawalpindi">Rawalpindi</option>
                                </Form.Select>
                                {errors.course && (
                                    <Form.Text className="text-danger">
                                        {errors.city.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Select Course or Event</Form.Label>
                                <Form.Select
                                    aria-label="Select Course"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("course", { required: "Course is required" })}
                                >
                                    <option value="">Select course or event</option>
                                    <option value="generative ai">Generative AI</option>
                                    <option value="data science">Data Science</option>
                                    <option value="web & app devleopment">Web & App Devleopment</option>
                                </Form.Select>
                                {errors.course && (
                                    <Form.Text className="text-danger">
                                        {errors.course.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Select Your Computer Proficiency</Form.Label>
                                <Form.Select
                                    aria-label="Select Proficiency"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("proficiency", { required: "Proficiency level is required" })}
                                >
                                    <option value="">Select your computer proficiency</option>
                                    <option value="none">None</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </Form.Select>
                                {errors.proficiency && (
                                    <Form.Text className="text-danger">
                                        {errors.proficiency.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Full name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Full name"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("fullName", {
                                        required: "Full name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Full name must be at least 3 characters"
                                        }
                                    })}
                                />
                                {errors.fullName && (
                                    <Form.Text className="text-danger">
                                        {errors.fullName.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Father name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Father name"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("fatherName", {
                                        required: "Father name is required",
                                        minLength: {
                                            value: 3,
                                            message: "Father name must be at least 3 characters"
                                        }
                                    })}
                                />
                                {errors.fatherName && (
                                    <Form.Text className="text-danger">
                                        {errors.fatherName.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Email</Form.Label>
                                <Form.Control
                                    placeholder="Email"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                />
                                {errors.email && (
                                    <Form.Text className="text-danger">
                                        {errors.email.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Phone</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Phone"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{11,13}$/,
                                            message: "Phone number must be 11-13 digits"
                                        }
                                    })}
                                />
                                {errors.phone && (
                                    <Form.Text className="text-danger">
                                        {errors.phone.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">CNIC</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="CNIC (without dashes)"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("cnic", {
                                        required: "CNIC is required",
                                        pattern: {
                                            value: /^[0-9]{13}$/,
                                            message: "CNIC must be 13 digits without dashes"
                                        }
                                    })}
                                />
                                {errors.cnic && (
                                    <Form.Text className="text-danger">
                                        {errors.cnic.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">
                                    Father's CNIC <span className="text-gray-500">(Optional)</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Father's CNIC (without dashes)"
                                    className={`py-3 border-2 form-border`}
                                    {...register("fatherCnic")}
                                />
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Date of birth</Form.Label>
                                <Form.Control
                                    type="date"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.fullName)}`}
                                    {...register("dob", {
                                        required: "Date of birth is required",
                                        validate: {
                                            validDate: (value) => {
                                                const dob = new Date(value)
                                                const today = new Date()
                                                const age = today.getFullYear() - dob.getFullYear()
                                                return age >= 13 || "You must be at least 13 years old"
                                            }
                                        }
                                    })}
                                />
                                {errors.dob && (
                                    <Form.Text className="text-danger">
                                        {errors.dob.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Select gender</Form.Label>
                                <Form.Select
                                    aria-label="Select Gender"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("gender", { required: "Gender is required" })}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                {errors.gender && (
                                    <Form.Text className="text-danger">
                                        {errors.gender.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Last qualification</Form.Label>
                                <Form.Select
                                    aria-label="Select Qualification"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("qualification", { required: "Qualification is required" })}
                                >
                                    <option value="">Last qualification</option>
                                    <option value="matric">Matric</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="graduate">Graduate</option>
                                    <option value="master">Master</option>
                                    <option value="other">Other</option>
                                </Form.Select>
                                {errors.qualification && (
                                    <Form.Text className="text-danger">
                                        {errors.qualification.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <Col md={12} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Do you have a Laptop?</Form.Label>
                                <Form.Select
                                    aria-label="Laptop Availability"
                                    className={`py-3 cursor-pointer form-border ${selectClasses(errors.city)}`}
                                    {...register("hasLaptop", { required: "This field is required" })}
                                >
                                    <option value="">Do you have a laptop</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Form.Select>
                                {errors.hasLaptop && (
                                    <Form.Text className="text-danger">
                                        {errors.hasLaptop.message}
                                    </Form.Text>
                                )}
                            </Col>
                            <Col md={6} className="mb-3">
                                <Form.Label className="mb-2 block lable-color font-medium">Upload Your Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    className={`py-3 border-2 form-border ${inputClasses(errors.image)}`}
                                    {...register("image", {
                                        required: "Image is required",
                                        validate: {
                                            checkFile: (value) =>
                                                value?.[0] instanceof File || "Image file is required",
                                        },
                                    })}
                                />
                                {errors.image && (
                                    <Form.Text className="text-danger">
                                        {errors.image.message}
                                    </Form.Text>
                                )}
                            </Col>

                            <hr />
                            <ol className="list-decimal space-y-2 text-sm text-gray-700 pl-5 mt-2">
                                <li>I hereby, solemnly declare that the data and facts mentioned herein are true and correct to the best of my knowledge. Further, I will abide by all the established and future regulations and policies of SWIT</li>
                                <li className='mt-1'>I hereby accept the responsibilities of good conduct and guarantee that I will not be involved in any other activity, political or ethical, but learning during my stay in the program.</li>
                                <li className='mt-1'>Defiance will render my admission canceled at any point in time.</li>
                                <li className='mt-1'>Upon completion, of the course, I will complete the required project by SWIT.</li>
                                <li className='mt-1'>It's mandatory for female students to wear abaya/hijab in the class</li>
                            </ol>

                            <Col md={12} className="mb-3">
                                <ReCAPTCHA
                                    sitekey="6Lefg1krAAAAAA7HsVRW8KK8awvX1W3NuLNb4Hs5"
                                    onChange={handleCaptchaChange}
                                />
                            </Col>

                            <button
                                type="submit"
                                disabled={!captchaValue || isSubmitting}
                                className={`border rounded py-2 px-4 text-white transition duration-300
                                        ${(!captchaValue || isSubmitting)
                                        ? 'bg-[#619fd0] cursor-default'
                                        : 'bg-[#0d6db7] cursor-pointer hover:bg-[#0b5a9a]'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </Row>
                    </form>
                </Container>
            </div>
        </div>
    )
}

export default RegForm