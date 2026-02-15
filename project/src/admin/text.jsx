
// // // for test  (8644)
import { useEffect, useState } from "react";
import FormStep1 from "./steps/FormStep1";
import FormStep2 from "./steps/FormStep2";
import FormStep3 from "./steps/FormStep3";
import FormStep4 from "./steps/FormStep4";
import FormStep5 from "./steps/FormStep5";
import ReviewStep from "./steps/ReviewStep";
import StepIndicator from "./steps/StepIndicator";
import FormStep6 from "./steps/FormStep6";

import { useNavigate, useParams } from "react-router-dom";
import { base_url } from "../../URL";
// import Breadcrumbs from "../../components/BreadCrumbs";

const FORM_STEPS = 6;  // Actual form steps
const TOTAL_STEPS = 7;  // Including review step

const MultiStepForm = () => {
    const [formStep, setFormStep] = useState(1);
    const [error, setError] = useState(false);
    const [periodError, setPeriodError] = useState(""); // From >= To error
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [draftId, setDraftId] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [reportDirectory, setReportDirectory] = useState([]);
    const [selectedReportId, setSelectedReportId] = useState("");
    const [versionNum, setVersionNum] = useState();
    const [versionID, setversionID] = useState("");

    // formstep1 state
    const [reportTitle, setReportTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [industry, setIndustry] = useState("");
    const [subIndustry, setSubIndustry] = useState("");
    const [regions, setRegions] = useState([]);
    const [country, setCountry] = useState([]);
    const [reportType, setReportType] = useState("");
    const [useCases, setUseCases] = useState("");
    const [publishDate, setPublishDate] = useState("");
    const [coveragePeriodFrom, setCoveragePeriodFrom] = useState("");
    const [coveragePeriodTo, setCoveragePeriodTo] = useState("");

    // formstep2 state
    const [reportCovers, setReportCovers] = useState([]);
    const [reportSupports, setReportSupports] = useState([]);

    // formstep3 state
    const [availableReports, setAvailableReports] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [samplePDF, setSamplePDF] = useState(null);
    const [image, setImage] = useState(null);
    const [charts, setCharts] = useState(null);

    // formstep4 state
    const [sectionName, setSectionName] = useState("");
    const [sectionGroup, setSectionGroup] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [previewAvailable, setPreviewAvailable] = useState(null);
    const [sDescription, setSDescription] = useState("");
    const [fullReport, setFullReport] = useState(null);
    const [sectionPDF, setSectionPDF] = useState(null);

    // formstep5 state
    const [reportPrice, setReportPrice] = useState("");

    // formstep6 state
    const [status, setStatus] = useState("");
    const [fHomepage, setFHomepage] = useState(null);
    const [seoSlug, setSeoSlug] = useState("");
    const [seoTitle, setSeoTitle] = useState("");
    const [seoKeywords, setSeoKeywords] = useState("");
    const [seoDescription, setSeoDescription] = useState("");

    // for get form data
    const [getIndustry, setGetIndustry] = useState([]);
    const [getSubindustry, setGetSubindustry] = useState([]);
    const [getRegions, setGetRegions] = useState([]);
    const [getCountries, setGetCountries] = useState([]);
    const [getReportTypes, setGetReportTypes] = useState([]);
    const [getuseCases, setGetUseCases] = useState([]);
    const [getAvailableReport, setGetAvailableReport] = useState([]);

    let param = useParams();
    let index = param.id;
    const navigate = useNavigate();

    console.log("index", index);

    const handleRadioChange = async (e) => {
        const value = e.target.value;
        setSelectedOption(value);

        if (value === "generated") {
            try {
                const res = await fetch(`${base_url}/reports/generating`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (data) {

                    console.log("reports generating id................", data?.reports);
                    setReportDirectory(data?.reports);
                }
            } catch (error) {
                console.error("API Error:", error);
                setError(true);
            }
        }
    };

    const getselectedReportIdData = async () => {
        if (!selectedReportId) return;
        try {
            const res = await fetch(`${base_url}/reports/generating/${selectedReportId}`, {
                method: "GET",
                credentials: "include"
            });

            if (!res.ok) throw new Error("Failed to fetch report data");

            const rData = await res.json();
            console.log("getselectedReportIdData:", rData);
            if (rData) {
                setVersionNum(rData?.version_number);
                setversionID(rData?.version_id || "");
                setReportTitle(rData?.title || "");
                setSubTitle(rData?.description || "");
            }
        } catch (err) {
            console.error("Report API Error:", err);
            setError(true);
        }
    };

    const saveStepData = async ({ step, payload }) => {
        try {
            // Check if either draftId or index exists
            const hasExistingId = draftId || index;
            console.log("hasExistingId: ", hasExistingId, "draftId:", draftId, "index:", index);

            const url = hasExistingId
                ? `${base_url}/reports/${draftId || index}/step${step}`
                : `${base_url}/reports/step${step}/save-draft`;
            const method = hasExistingId ? "PUT" : "POST";

            console.log("Calling URL:", url, "with method:", method);

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            if (!res.ok) {
                console.log("Failed to save step data");
            }

            const data = await res.json();
            console.log("postData: ", data);

            // If this was a POST request (new draft) and we got a report_id, set it
            if (!hasExistingId && data?.report_id) {
                setDraftId(data.report_id);
            }

            return { success: true, data };
        } catch (err) {
            console.error("Save Step Error:", err);
            throw err;
        }
    };

    const handleNext = async () => {
        try {
            setIsSubmitting(true);

            // Step 1 Validation
            if (formStep === 1) {
                if (!reportTitle || !subTitle || !industry || !subIndustry || regions.length === 0 || country.length === 0 || !reportType || !useCases || !publishDate || !coveragePeriodFrom || !coveragePeriodTo) {
                    setError(true);
                    return;
                }
                setError(false);

                if (Number(coveragePeriodFrom) >= Number(coveragePeriodTo)) {
                    setPeriodError("Coverage Period From must be smaller than Coverage Period To");
                    return;
                }
                setPeriodError("");

                const payload = {
                    title: reportTitle,
                    subtitle: subTitle,
                    industry_id: industry,
                    sub_industry_id: subIndustry,
                    region_id: regions,
                    country_id: country,
                    report_type_id: reportType,
                    use_case_id: useCases,
                    version_id: versionID,
                    coverage_start_year: Number(coveragePeriodFrom),
                    coverage_end_year: Number(coveragePeriodTo),
                    publish_date: publishDate
                };

                await saveStepData({ step: 1, payload });
            }

            // Step 2 Validation
            if (formStep === 2) {
                if (reportCovers.length === 0 || reportSupports.length === 0) {
                    setError(true);
                    return;
                }
                setError(false);

                const payload = {
                    covers: reportCovers,
                    supports_decisions: reportSupports
                };

                await saveStepData({ step: 2, payload });
            }

            // Step 3 Validation
            // if (formStep === 3) {

            //     const isEditMode = Boolean(index);

            //     // New report me mandatory
            //     if (!isEditMode) {
            //         if (!availableReports && !uploadedFile) {
            //             setError(true);
            //             return;
            //         }
            //         if (!samplePDF) {
            //             setError(true);
            //             return;
            //         }
            //     }

            //     // File select hui hai to type check hoga (edit + new dono me)
            //     if (uploadedFile && uploadedFile.type !== "application/pdf") {
            //         setError(true);
            //         return;
            //     }

            //     if (samplePDF && samplePDF.type !== "application/pdf") {
            //         setError(true);
            //         return;
            //     }

            //     if (charts && charts.type !== "application/pdf") {
            //         setError(true);
            //         return;
            //     }

            //     if (image && image.type !== "image/webp") {
            //         setError(true);
            //         return;
            //     }

            //     setError(false);
            if (formStep === 3) {

                const isEditMode = Boolean(index);

                // EDIT MODE: koi file change hi nahi hui → API mat call karo
                if (
                    isEditMode &&
                    !uploadedFile &&
                    !samplePDF &&
                    !charts &&
                    !image
                ) {
                    setError(false);
                    setFormStep(formStep + 1);
                    return;
                }

                // NEW REPORT: mandatory checks
                if (!isEditMode) {
                    if (!availableReports && !uploadedFile) {
                        setError(true);
                        return;
                    }
                    if (!samplePDF) {
                        setError(true);
                        return;
                    }
                    if (!image) {
                        setError(true);
                        return;
                    }
                }

                // File type validation (edit + new dono)
                if (uploadedFile && uploadedFile.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (samplePDF && samplePDF.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (charts && charts.type !== "application/pdf") {
                    setError(true);
                    return;
                }

                if (image && image.type !== "image/webp") {
                    setError(true);
                    return;
                }

                setError(false);


                const formData = new FormData();
                if (availableReports) formData.append("full_asset_id", availableReports);
                if (uploadedFile) formData.append("full_pdf", uploadedFile);
                if (samplePDF) formData.append("sample_pdf", samplePDF);
                if (charts) formData.append("charts_pdf", charts);
                if (image) formData.append("image_file", image);

                console.log("formData.....????????????????", formData);

                try {
                    const hasExistingId = draftId || index;
                    const res = await fetch(
                        hasExistingId
                            ? `${base_url}/reports/${draftId || index}/step3`
                            : `${base_url}/reports/step3/save-draft`,
                        {
                            method: hasExistingId ? "PUT" : "POST",
                            body: formData,
                            credentials: "include"
                        }
                    );

                    const data = await res.json();
                    console.log("step3: ", data);

                    if (!res.ok) {
                        console.log("Upload failed");
                    }
                } catch (err) {
                    setError(true);
                    return;
                }
            }

            // Step 4 Validation
            if (formStep === 4) {
                // No validation needed for step 4
                // we can add validation here if needed
            }

            // Step 5 Validation
            if (formStep === 5) {
                // Price validation (uncomment if needed)
                // if (!reportPrice || isNaN(reportPrice) || Number(reportPrice) <= 0) {
                //     setError(true);
                //     return;
                // }
                // setError(false);

                const payload = {
                    amount_cents: Number(reportPrice),
                    download_allowed: true,
                    online_viewing_allowed: true
                };

                await saveStepData({ step: 4, payload });
            }

            // Step 6 Validation and Final Submit
            if (formStep === 6) {
                if (!seoSlug.trim() || !seoTitle.trim() || !seoKeywords.trim() || !seoDescription.trim() || fHomepage === null) {
                    setError(true);
                    return;
                }
                setError(false);

                const payload = {
                    status,
                    seo_slug: seoSlug,
                    seo_title: seoTitle,
                    seo_keywords: seoKeywords,
                    seo_description: seoDescription,
                    feature_homepage: fHomepage
                };

                await saveStepData({ step: 5, payload });

                console.log("FINAL SUBMIT DONE");
                alert("Report published successfully!");

                // Redirect after successful submission
                navigate('/all');
                return;
            }

            // Move to next step
            if (formStep < 6) {
                setFormStep(formStep + 1);
            }
        } catch (err) {
            console.error("Handle Next Error:", err);
            setError(true);
            alert("Error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSaveDraft = async () => {
        try {
            setIsSubmitting(true);

            // For each step, save data without validation
            if (formStep === 1) {
                const payload = {
                    title: reportTitle || "",
                    subtitle: subTitle || "",
                    industry_id: industry || "",
                    sub_industry_id: subIndustry || "",
                    region_id: regions || [],
                    country_id: country || [],
                    report_type_id: reportType || "",
                    use_case_id: useCases || "",
                    version_id: versionID || "",
                    coverage_start_year: Number(coveragePeriodFrom) || 0,
                    coverage_end_year: Number(coveragePeriodTo) || 0,
                    publish_date: publishDate || ""
                };
                await saveStepData({ step: 1, payload });
            } else if (formStep === 2) {
                const payload = {
                    covers: reportCovers || [],
                    supports_decisions: reportSupports || []
                };
                await saveStepData({ step: 2, payload });
            } else if (formStep === 3) {
                const formData = new FormData();
                if (availableReports) formData.append("full_asset_id", availableReports);
                if (uploadedFile) formData.append("full_pdf", uploadedFile);
                if (samplePDF) formData.append("sample_pdf", samplePDF);
                if (charts) formData.append("charts_pdf", charts);
                if (image) formData.append("image_file", image);

                console.log("formData.....????????????????", [...formData]);

                const hasExistingId = draftId || index;
                const res = await fetch(
                    hasExistingId
                        ? `${base_url}/reports/${draftId || index}/step3`
                        : `${base_url}/reports/step3/save-draft`,
                    {
                        method: hasExistingId ? "PUT" : "POST",
                        body: formData,
                        credentials: "include"
                    }
                );

                if (!res.ok) {
                    console.log("Failed to save draft");
                }
            } else if (formStep === 5) {
                const payload = {
                    amount_cents: Number(reportPrice) || 0,
                    download_allowed: true,
                    online_viewing_allowed: true
                };
                await saveStepData({ step: 4, payload });
            } else if (formStep === 6) {
                const payload = {
                    status: status || "",
                    seo_slug: seoSlug || "",
                    seo_title: seoTitle || "",
                    seo_keywords: seoKeywords || "",
                    seo_description: seoDescription || "",
                    feature_homepage: fHomepage || false
                };
                await saveStepData({ step: 5, payload });
            }

            alert("Draft saved successfully!");
        } catch (err) {
            console.error("Save Draft Error:", err);
            setError(true);
            alert("Failed to save draft. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePrev = () => {
        if (formStep === 7) {
            setFormStep(6);
        } else if (formStep > 1) {
            setFormStep(formStep - 1);
        }
    };

    const getIndustryData = async () => {
        try {
            let result = await fetch(`${base_url}/industries/main`);
            let data = await result.json();
            if (data) {
                setGetIndustry(data?.industries || []);
            }
        } catch (err) {
            console.error("Error fetching industries:", err);
        }
    };

    const getSubIndustryData = async () => {
        if (!industry) return;
        try {
            const url = `${base_url}/industries/sub?industry=${encodeURIComponent(industry)}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data) {
                setGetSubindustry(data?.sub_industries || []);
            }
        } catch (err) {
            console.log("Error fetching sub-industries:", err);
        }
    };

    const getRegionsData = async () => {
        try {
            let result = await fetch(`${base_url}/regions`);
            let data = await result.json();
            if (data) {
                setGetRegions(data?.regions || []);
            }
        } catch (err) {
            console.log("Error fetching regions:", err);
        }
    };

    const getReportData = async () => {
        try {
            let result = await fetch(`${base_url}/report-types`);
            let data = await result.json();
            if (data) {
                setGetReportTypes(data?.report_types || []);
                setGetUseCases(data?.use_cases || []);
            }
            //////////////////////////////////////////////////////////////////////////////
        } catch (err) {
            console.log("Error fetching report types:", err);
        }
    };

    const getCountriesByRegion = async () => {
        try {
            if (!regions || regions.length === 0) {
                setGetCountries([]);
                return;
            }

            const regionParam = regions.join(",");
            const url = `${base_url}/countries?region=${encodeURIComponent(regionParam)}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch countries");

            const data = await res.json();
            if (data) {
                setGetCountries(data?.countries || []);
            }
        } catch (err) {
            console.error("Country API Error:", err);
        }
    };

    const getAvailableReportsData = async () => {
        console.log("versionID.............: ", versionID);

        try {
            const res = await fetch(`${base_url}/report-assets/?report_version_id=${versionID}`, {
                method: "GET",
                credentials: "include"
            });
            if (!res.ok) throw new Error("Failed to fetch available reports");

            const fData = await res.json();

            console.log("fdata....................", fData);

            if (fData) {
                setGetAvailableReport(fData || []);
            }
        } catch (err) {
            console.log("Available Reports API Error:", err);
        }
    };

    useEffect(() => {
        getIndustryData();
        getRegionsData();
        getReportData();

    }, []);

    useEffect(() => {
        if (versionID) {
            getAvailableReportsData();
        }
    }, [versionID]);

    // useEffect(() => {

    //         getAvailableReportsData();

    // }, []);

    useEffect(() => {
        if (industry) {
            getSubIndustryData();
        }
    }, [industry]);

    useEffect(() => {
        if (regions.length > 0) {
            getCountriesByRegion();
        } else {
            setGetCountries([]);
            setCountry([]);
        }
    }, [regions]);

    useEffect(() => {
        if (selectedReportId) {
            getselectedReportIdData();
        }
    }, [selectedReportId]);

    // for edit getdata
    const getReportDataForEdit = async () => {
        try {
            let result = await fetch(`${base_url}/reports/${index}/edit`, {
                method: "GET",
                credentials: "include"
            });
            let data = await result.json();
            console.log("getd1", data);

            // Set draftId from edit data if available
            if (data?.report_id) {

                console.log("draftid.....................", data.report_id);
                setDraftId(data.report_id);
            }

            // Check step data according to your API response structure
            if (data?.step_data?.step1) {
                let stp1 = data?.step_data?.step1;
                setversionID(stp1?.version_id);
                setReportTitle(stp1?.title || "");
                setSubTitle(stp1?.subtitle || "");
                setIndustry(stp1?.industry_name || "");
                setSubIndustry(stp1?.sub_industry_name || "");
                setRegions(stp1?.region_names || []);
                setCountry(stp1?.country_names || []);
                setReportType(stp1?.report_type_name || "");
                setUseCases(stp1?.use_case_name || "");
                setPublishDate(stp1?.publish_date || "");
                setCoveragePeriodFrom(stp1?.coverage_start_year || "");
                setCoveragePeriodTo(stp1?.coverage_end_year || "");
            }
            if (data?.step_data?.step2) {
                let stp2 = data?.step_data?.step2;
                console.log("ste2", stp2);
                setReportCovers(Array.isArray(stp2?.covers) ? stp2.covers : []);
                setReportSupports(Array.isArray(stp2?.supports_decisions) ? stp2.supports_decisions : []);
            }

            if (data?.step_data?.step3) {
                let stp3 = data?.step_data?.step3;
                console.log("step3: ", stp3);
                // Set existing files info if available
                // Note: You might need to handle file URLs differently
                // since you can't directly set File objects from API response
                setAvailableReports(stp3?.full_asset_id || "");
                // For files, you might want to store URLs or file names
                // setUploadedFile(stp3?.full_pdf_url || null);
                // setSamplePDF(stp3?.sample_pdf_url || null);
                // setImage(stp3?.image_url || null);
                // setCharts(stp3?.charts_pdf_url || null);
            }

            // API might return step4 for price and step5 for SEO
            if (data?.step_data?.step4) {
                let stp4 = data?.step_data?.step4;
                console.log("step4: ", stp4);
                setReportPrice(stp4?.amount_cents || "");
            }
            if (data?.step_data?.step5) {
                let stp5 = data?.step_data?.step5;
                console.log("step5: ", stp5);
                setStatus(stp5?.status || "");
                setFHomepage(stp5?.feature_homepage || false);
                setSeoSlug(stp5?.seo_slug || "");
                setSeoTitle(stp5?.seo_title || "");
                setSeoKeywords(stp5?.seo_keywords || "");
                setSeoDescription(stp5?.seo_description || "");
            }
        }
        catch (err) {
            console.log("Something went wrong...");
        }
    }

    useEffect(() => {
        if (index) {
            getReportDataForEdit();
        }
    }, [index]);

    console.log("selected report versionID:...........", versionID);

    return (
        <div className="bg-gray-100">
            <>

                {/* breadcrumbs */}
                {/* <div className="border w-80 sm:w-160 md:w-190 lg:w-230 m-auto py-2">
                    <Breadcrumbs />
                </div> */}
                {/* steps */}
                <div className="hidden lg:block">
                    <StepIndicator step={formStep} setStep={setFormStep} />
                </div>

                <div className="border border-gray-200 rounded w-80 sm:w-160 md:w-190 lg:w-230 m-auto p-2 bg-surface">
                    {formStep === 1 && (
                        <FormStep1
                            selectedOption={selectedOption}
                            handleRadioChange={handleRadioChange}
                            reportDirectory={reportDirectory}
                            selectedReportId={selectedReportId}
                            setSelectedReportId={setSelectedReportId}
                            versionNum={versionNum}
                            reportTitle={reportTitle}
                            setReportTitle={setReportTitle}
                            subTitle={subTitle}
                            setSubTitle={setSubTitle}
                            industry={industry}
                            setIndustry={setIndustry}
                            subIndustry={subIndustry}
                            setSubIndustry={setSubIndustry}
                            regions={regions}
                            setRegions={setRegions}
                            country={country}
                            setCountry={setCountry}
                            reportType={reportType}
                            setReportType={setReportType}
                            useCases={useCases}
                            setUseCases={setUseCases}
                            publishDate={publishDate}
                            setPublishDate={setPublishDate}
                            coveragePeriodFrom={coveragePeriodFrom}
                            setCoveragePeriodFrom={setCoveragePeriodFrom}
                            coveragePeriodTo={coveragePeriodTo}
                            setCoveragePeriodTo={setCoveragePeriodTo}
                            error={error}
                            getIndustry={getIndustry}
                            getSubindustry={getSubindustry}
                            getRegions={getRegions}
                            getCountries={getCountries}
                            getReportTypes={getReportTypes}
                            getuseCases={getuseCases}
                            periodError={periodError}
                        />
                    )}
                    {formStep === 2 && (
                        <FormStep2
                            reportCovers={reportCovers}
                            setReportCovers={setReportCovers}
                            reportSupports={reportSupports}
                            setReportSupports={setReportSupports}
                            error={error}
                            draftId={draftId}
                        />
                    )}
                    {formStep === 3 && (
                        <FormStep3
                            availableReports={availableReports}
                            setAvailableReports={setAvailableReports}
                            uploadedFile={uploadedFile}
                            setUploadedFile={setUploadedFile}
                            samplePDF={samplePDF}
                            setSamplePDF={setSamplePDF}
                            image={image}
                            setImage={setImage}
                            charts={charts}
                            setCharts={setCharts}
                            getAvailableReport={getAvailableReport}
                            error={error}
                        />
                    )}
                    {formStep === 4 && (
                        <FormStep4
                            sectionName={sectionName}
                            setSectionName={setSectionName}
                            sectionGroup={sectionGroup}
                            setSectionGroup={setSectionGroup}
                            shortDescription={shortDescription}
                            setShortDescription={setShortDescription}
                            previewAvailable={previewAvailable}
                            setPreviewAvailable={setPreviewAvailable}
                            sDescription={sDescription}
                            setSDescription={setSDescription}
                            fullReport={fullReport}
                            setFullReport={setFullReport}
                            sectionPDF={sectionPDF}
                            setSectionPDF={setSectionPDF}
                            error={error}
                        />
                    )}
                    {formStep === 5 && (
                        <FormStep5
                            reportPrice={reportPrice}
                            setReportPrice={setReportPrice}
                            error={error}
                        />
                    )}
                    {formStep === 6 && (
                        <FormStep6
                            status={status}
                            setStatus={setStatus}
                            fHomepage={fHomepage}
                            setFHomepage={setFHomepage}
                            seoSlug={seoSlug}
                            setSeoSlug={setSeoSlug}
                            seoTitle={seoTitle}
                            setSeoTitle={setSeoTitle}
                            seoKeywords={seoKeywords}
                            setSeoKeywords={setSeoKeywords}
                            seoDescription={seoDescription}
                            setSeoDescription={setSeoDescription}
                            error={error}
                        />
                    )}
                    {formStep === 7 && (
                        <ReviewStep
                            draftId={draftId}
                            reportTitle={reportTitle}
                            subTitle={subTitle}
                            industry={industry}
                            subIndustry={subIndustry}
                            regions={regions}
                            country={country}
                            reportType={reportType}
                            useCases={useCases}
                            publishDate={publishDate}
                            coveragePeriodFrom={coveragePeriodFrom}
                            coveragePeriodTo={coveragePeriodTo}
                            reportCovers={reportCovers}
                            reportSupports={reportSupports}
                            availableReports={availableReports}
                            uploadedFile={uploadedFile}
                            samplePDF={samplePDF}
                            image={image}
                            charts={charts}
                            sectionName={sectionName}
                            sectionGroup={sectionGroup}
                            shortDescription={shortDescription}
                            previewAvailable={previewAvailable}
                            sDescription={sDescription}
                            fullReport={fullReport}
                            sectionPDF={sectionPDF}
                            reportPrice={reportPrice}
                            status={status}
                            fHomepage={fHomepage}
                            seoSlug={seoSlug}
                            seoTitle={seoTitle}
                            seoKeywords={seoKeywords}
                            seoDescription={seoDescription}
                        />
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="relative h-14 rounded w-230 m-auto my-4">
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                        {/* Back Button */}
                        {formStep >= 2 && formStep < 7 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handlePrev}
                                disabled={isSubmitting}
                            >
                                Back
                            </button>
                        )}

                        {/* Save Draft Button */}
                        {formStep <= 6 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSaveDraft}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Save Draft"}
                            </button>
                        )}

                        {/* Next Button (Steps 1-5) */}
                        {formStep <= 5 && (
                            <button
                                className="border px-4 h-9 font-medium cursor-pointer hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleNext}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Next"}
                            </button>
                        )}

                        {/* Step 6 Buttons (Review and Publish) */}
                        {formStep === 6 && (
                            <>
                                <button
                                    className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setFormStep(7)}
                                    disabled={isSubmitting}
                                >
                                    Review
                                </button>
                                <button
                                    className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Publishing..." : "Publish Report"}
                                </button>
                            </>
                        )}

                        {/* Step 7 Back Button */}
                        {formStep === 7 && (
                            <button
                                className="border px-4 h-9 font-medium text-primary border-text-primary hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={() => setFormStep(6)}
                                disabled={isSubmitting}
                            >
                                Back to Edit
                            </button>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
};

export default MultiStepForm;
