import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { OnboardingProvider } from './store/OnboardingContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { OnboardingLayout } from './screens/onboarding/OnboardingLayout';
import { Splash } from './screens/onboarding/Splash';
import { TrackCalories } from './screens/onboarding/TrackCalories';
import { StayHydrated } from './screens/onboarding/StayHydrated';
import { DailySummary } from './screens/onboarding/DailySummary';
import { MeetYourPal } from './screens/onboarding/MeetYourPal';
import { GoalSelection } from './screens/onboarding/GoalSelection';
import { PaceSelection } from './screens/onboarding/PaceSelection';
import { ProfileSetup } from './screens/onboarding/ProfileSetup';
import { HomeScreen } from './screens/home/HomeScreen';
import { MealLoggingScreen } from './screens/home/MealLoggingScreen';
import { AuthScreen } from './screens/auth/AuthScreen';
import { ProfileScreen } from './screens/profile/ProfileScreen';
import { EditPasswordScreen } from './screens/profile/EditPasswordScreen';
import { EditGoalsScreen } from './screens/profile/EditGoalsScreen';
import { BottomNav } from './components/BottomNav';
const MainLayout = () => (
  <>
    <Outlet />
    <BottomNav />
  </>
);

const Placeholder = ({ name }: { name: string }) => (
  <div className="flex min-h-[100dvh] items-center justify-center text-muted">
    {name}
  </div>
);

export const App = () => {
  return (
    <OnboardingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/auth" element={<AuthScreen />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingLayout />}>
              <Route index element={<Navigate to="2" replace />} />
              <Route path="2" element={<TrackCalories />} />
              <Route path="3" element={<StayHydrated />} />
              <Route path="4" element={<DailySummary />} />
              <Route path="5" element={<MeetYourPal />} />
              <Route path="6" element={<GoalSelection />} />
              <Route path="7" element={<PaceSelection />} />
              <Route path="8" element={<ProfileSetup />} />
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/meal/:mealType" element={<MealLoggingScreen />} />
              <Route path="/log" element={<Placeholder name="Log" />} />
              <Route path="/water" element={<Placeholder name="Water" />} />
              <Route
                path="/progress"
                element={<Placeholder name="Progress" />}
              />
              <Route path="/profile" element={<ProfileScreen />} />
            </Route>
            <Route path="/profile/password" element={<EditPasswordScreen />} />
            <Route path="/profile/goals" element={<EditGoalsScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </OnboardingProvider>
  );
};
