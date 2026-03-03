import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./index.css";

// Colors for each era
const eraColors = {
  Colonial: "#f1c40f",
  Revolution: "#e74c3c",
  CivilWar: "#e67e22",
  Industrial: "#3498db",
  WWI: "#95a5a6",
  Modern: "#1abc9c"
};

// Sample data
const initialClasses = [
  {
    id: 1,
    name: "US History",
    students: 28,
    assignments: [
      {
        id: 1,
        title: "American Revolution Timeline",
        events: [
          {
            id: 1,
            era: "Revolution",
            date: "1765",
            title: "Stamp Act",
            description: "Parliament passed the Stamp Act taxing printed materials.",
            quiz: [
              {
                question: "What was taxed under the Stamp Act?",
                options: ["Tea", "Printed materials", "Land", "Ships"],
                answer: 1
              }
            ]
          },
          {
            id: 2,
            era: "Revolution",
            date: "1773",
            title: "Boston Tea Party",
            description: "Colonists protested British taxes by dumping tea into the harbor.",
            quiz: [
              {
                question: "Which city hosted the Boston Tea Party?",
                options: ["New York", "Boston", "Philadelphia", "Charleston"],
                answer: 1
              }
            ]
          }
        ]
      }
    ]
  }
];

const roles = ["Teacher", "Student"];

export default function App() {
  const [role, setRole] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  // Handle drag & drop of events
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const events = Array.from(selectedAssignment.events);
    const [removed] = events.splice(result.source.index, 1);
    events.splice(result.destination.index, 0, removed);
    const newClasses = initialClasses.map((cls) => {
      if (cls.id === selectedClass.id) {
        return {
          ...cls,
          assignments: cls.assignments.map((assn) =>
            assn.id === selectedAssignment.id ? { ...assn, events } : assn
          )
        };
      }
      return cls;
    });
    setSelectedAssignment({ ...selectedAssignment, events });
    setSelectedClass({ ...selectedClass, assignments: newClasses[0].assignments });
  };

  // Role selection screen
  if (!role) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>ChronoClass Pro</h1>
        <h2>Select your role:</h2>
        {roles.map((r) => (
          <button key={r} onClick={() => setRole(r)} style={{ margin: "10px", padding: "10px 20px" }}>{r}</button>
        ))}
      </div>
    );
  }

  // Teacher view
  if (role === "Teacher") {
    if (!selectedClass) {
      return (
        <div style={{ padding: "20px" }}>
          <h2>Your Classes</h2>
          {initialClasses.map((cls) => (
            <div key={cls.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                 onClick={() => setSelectedClass(cls)}>
              <h3>{cls.name}</h3>
              <p>{cls.students} students</p>
            </div>
          ))}
        </div>
      );
    }

    if (!selectedAssignment) {
      return (
        <div style={{ padding: "20px" }}>
          <button onClick={() => setSelectedClass(null)}>Back to Classes</button>
          <h2>{selectedClass.name} Assignments</h2>
          {selectedClass.assignments.map((assn) => (
            <div key={assn.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
                 onClick={() => setSelectedAssignment(assn)}>
              <h3>{assn.title}</h3>
              <p>{assn.events.length} events</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ padding: "20px" }}>
        <button onClick={() => setSelectedAssignment(null)}>Back to Assignments</button>
        <h2>{selectedAssignment.title} Timeline Builder</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="events">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {selectedAssignment.events.map((event, index) => (
                  <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="timeline-event"
                        style={{ borderLeftColor: eraColors[event.era] }}
                      >
                        {event.date} – {event.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }

  // Student view
  const timeline = initialClasses[0].assignments[0];

  return (
    <div style={{ padding: "20px" }}>
      <h2>{timeline.title}</h2>
      {timeline.events.map((event) => (
        <div key={event.id} className="timeline-event" style={{ borderLeftColor: eraColors[event.era] }}>
          <h3>{event.date} – {event.title}</h3>
          <p>{event.description}</p>
          {event.quiz && event.quiz.map((q, i) => (
            <div key={i}>
              <p>{q.question}</p>
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuizAnswers({ ...quizAnswers, [q.question]: idx })}
                  style={{ margin: "4px", padding: "4px 8px",
                    backgroundColor: quizAnswers[q.question] === idx
                      ? idx === q.answer ? "#7bed9f" : "#ff6b6b"
                      : "#ddd"
                  }}
                >
                  {opt}
                </button>
              ))}
              {quizAnswers[q.question] === q.answer && <p>Correct!</p>}
              {quizAnswers[q.question] !== undefined && quizAnswers[q.question] !== q.answer && <p>Incorrect</p>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
