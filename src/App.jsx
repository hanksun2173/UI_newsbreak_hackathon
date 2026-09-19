import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Home from './pages/Home.jsx';
import Schedule from './pages/Schedule.jsx';
import Plan from './pages/Plan.jsx';
import Events from './pages/Events.jsx';
import People from './pages/People.jsx';
import FollowUps from './pages/FollowUps.jsx';
import GoalSetup from './pages/GoalSetup.jsx';
import Prep from './pages/Prep.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/plan" element={<Plan />} />
      <Route path="/events" element={<Events />} />
      <Route path="/people" element={<People />} />
      <Route path="/follow-ups" element={<FollowUps />} />
      <Route path="/goal-setup" element={<GoalSetup />} />
      <Route path="/prep" element={<Prep />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
