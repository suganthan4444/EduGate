import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';
import './EducatorCourses.css';

function EducatorCourses({ educatorId }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await api.get(`/educator-courses/${educatorId}`);
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, [educatorId]);

    const handleAddCourse = () => {
        navigate('/add-course');
    };

    return (
        <div className="educator-courses">
            {loading && <div>Loading...</div>}
            {!loading && courses.length === 0 && <div>No Courses Released</div>}
            {!loading && (
                <>
                    {courses.map(course => (
                        <Link to={`/educator-course/${course.id}`} key={course.id}>
                            <div className="course-card">
                                <img src={course.course_thumbnail} alt={course.course_name} />
                                <div className="course-info">
                                    <h3>{course.course_name}</h3>
                                    <p>Price: {course.price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <button className="add-course-button" onClick={handleAddCourse}>Add Course</button>
                </>
            )}
        </div>
    );
}

export default EducatorCourses;
