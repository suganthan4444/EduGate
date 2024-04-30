import React, { useEffect, useState } from 'react';
import './LearnerCourses.css';
import { useParams } from 'react-router-dom';

function LearnerCourses() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [courseExercises, setCourseExercises] = useState([]);
  const [courseVideos, setCourseVideos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/learner-courses/${courseId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        return response.json();
      })
      .then(data => {
        setCourse(data.course);
        setCourseExercises(data.exercises);
        setCourseVideos(data.videos);
      })
      .catch(error => {
        console.error('Error fetching course data:', error);
        setError('Failed to load course data. Please try again later.');
      });
  }, [courseId]);

  const handleCourseCompletion = () => {
    const allVideosWatched = courseVideos.every(video => video.isWatched);
    const allExercisesCompleted = courseExercises.every(exercise => exercise.isCompleted);

    if (allVideosWatched && allExercisesCompleted) {
      alert('Course completed! You have earned a completion certificate.');
    } else {
      alert('Please complete all videos and exercises to finish the course.');
    }
  };

  return (
    <div className="course-details">
      {error ? (
        <p className="error">{error}</p>
      ) : course ? (
        <>
          <h2>{course.Course_Name}</h2>
          <img
            src={course.Course_Thumbnail}
            alt={`${course.Course_Name} thumbnail`}
            className="course-thumbnail"
          />
          <p>Duration: {course.Course_Duration}</p>
          <h3>Educator: {course.Course_Educator_Name}</h3>
          <p>{course.Course_Description}</p>

          <div className="course-videos">
            <h3>Course Videos</h3>
            {courseVideos.map(video => (
              <div key={video.Course_Video_ID}>
                <h4>{video.title}</h4>
                {/* Include video component or iframe for video playback here */}
                {/* E.g., <video src={video.url} controls /> */}
                <p>Status: {video.isWatched ? 'Watched' : 'Not watched'}</p>
              </div>
            ))}
          </div>

          <div className="course-exercises">
            <h3>Course Exercises</h3>
            {courseExercises.map(exercise => (
              <div key={exercise.Course_Exercise_ID}>
                <h4>{exercise.title}</h4>
                {/* Include exercise component or form for exercise handling here */}
                {/* E.g., <p>{exercise.description}</p> */}
                <p>Status: {exercise.isCompleted ? 'Completed' : 'Not completed'}</p>
              </div>
            ))}
          </div>

          {/* Button to handle course completion */}
          <button onClick={handleCourseCompletion}>Check Course Completion</button>
        </>
      ) : (
        <p>Loading course data...</p>
      )}
    </div>
  );
}

export default LearnerCourses;
