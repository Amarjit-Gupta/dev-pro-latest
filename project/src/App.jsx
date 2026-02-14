import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ReportingList from "./components/ReportingList";
import MultiStepForm from "./admin/addData/MultiStepForm";
import Login from "./auth/Login";
import Dash from "./admin/Dash";
import AllReports from "./admin/AllReports";
import SingleReport from "./admin/SingleReport";
import ReportName from "./components/ReportName";
import ContactUs from "./components/ContactUs";
import HomePage from "./components/HomePage";
import PrivateComponent from "./auth/PrivateComponent";
import { Toaster } from 'react-hot-toast';
import FilteredIndustry from "./components/FilteredIndustry";
import FilteredReportType from "./components/FilteredReportType";
import FilteredUseCases from "./components/FilteredUseCases";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/report" element={<ReportingList />} />
          <Route path="/industry/:slug" element={<FilteredIndustry />} />
          <Route path="/report-type/:slug" element={<FilteredReportType />} />
          <Route path="/usecase/:slug" element={<FilteredUseCases />} />
          <Route path="/report-name/:id" element={<ReportName />} />
          <Route element={<PrivateComponent />}>
            <Route path="/add" element={<MultiStepForm />} />
            <Route path="/add/:id" element={<MultiStepForm />} />
            <Route path="/dash" element={<Dash />} />
            <Route path="/all" element={<AllReports />} />
            <Route path="/single-report/:id" element={<SingleReport />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;

// //
// //industry:
// Food & Drink ----   food-drink
// Beauty & Personal Care ----   beauty-personal-care
// Household ----   household
// Pharmaceuticals ---  pharmaceuticals
// Nutraceuticals ---- nutraceuticals
// Medical Nutrition ----  medical-nutrition
// Vitamins & Minerals ----  vitamins-minerals
// Amino Acids ----   amino-acids
// Herbal Extracts ----  herbal-extracts
// Functional Ingredients ----   functional-ingredients
// Chemicals ---  chemicals
// Agriculture ----  agriculture
// Future Updates ----  future-updates
// Ingredients & Materials ----  ingredients-materials
// Health & Wellness ---  health-wellness
// Consumer Goods ----  consumer-goods
