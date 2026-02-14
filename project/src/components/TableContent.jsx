import { useRef, useState } from "react";
import { RxCaretDown } from "react-icons/rx";

const prepareAccordionData = (sections = []) => {
    if (!Array.isArray(sections) || sections.length === 0) {
        return [];
    }
    const result = [];
    let currentMain = null;
    let currentSub = null;

    sections.forEach((rawSection) => {
        if (typeof rawSection !== "string") return;
        const section = rawSection.trim();
        if (!section) return;
        const firstToken = section.split(" ")[0];
        if (!firstToken) return;
        const parts = firstToken.split(".").filter(Boolean);
        const level = parts.length;

        // level 1
        if (level === 1) {
            currentMain = {
                value: `section-${parts[0]}`,
                trigger: section,
                content: [],
            };

            result.push(currentMain);
            currentSub = null;
            return;
        }

        //  level 2 
        if (level === 2 && currentMain) {
            currentSub = {
                title: section,
                children: [],
            };

            currentMain.content.push(currentSub);
            return;
        }

        // level 3 
        if (level === 3 && currentMain) {
            if (!currentSub) {
                const autoSubNumber = parts.slice(0, 2).join(".");
                currentSub = {
                    title: `${autoSubNumber} Auto Section`,
                    children: [],
                };
                currentMain.content.push(currentSub);
            }

            currentSub.children.push(section);
        }
    });

    return result;
};


const TableContent = ({ tableContent }) => {

    if (!Array.isArray(tableContent) || tableContent.length === 0) {
        return null;
    }

    const accordionItems = prepareAccordionData(tableContent);

    const [openSection, setOpenSection] = useState(null);

    const refs = useRef({});

    const toggleSection = (value) => {
        setOpenSection(openSection === value ? null : value);
    };

    return (
        <div>
            {accordionItems.map((item) => {
                const isOpen = openSection === item.value;
                return (
                    <div key={item.value} className=" rounded mb-2 overflow-hidden">
                        <button
                            onClick={() => toggleSection(item.value)}
                            className="w-full flex justify-between items-center px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                        >
                            <div className="flex gap-2 flex-wrap">
                                <span className="font-bold text-15 sm:text-base">
                                    {item.trigger.split(" ")[0]}
                                </span>
                                <span className="text-primary">
                                    {item.trigger.split(" ").slice(1).join(" ")}
                                </span>
                            </div>
                            <RxCaretDown
                                className={`text-20 transition-transform ${isOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>
                        <div
                            ref={(el) => (refs.current[item.value] = el)}
                            style={{
                                maxHeight: isOpen
                                    ? refs.current[item.value]?.scrollHeight + "px"
                                    : "0px",
                                overflow: "hidden",
                                transition: "max-height 0.3s ease",
                            }}
                        >
                            <div className="px-4 sm:px-6 py-3 bg-surface">
                                {item.content.map((sub, idx) => (
                                    <div key={idx} className="mb-2">
                                        {/* level 2 */}
                                        <div className="flex gap-4">
                                            <span className="font-medium text-15 sm:text-base">
                                                {sub.title.split(" ")[0]}
                                            </span>
                                            <span className="text-15 sm:text-base">
                                                {sub.title.split(" ").slice(1).join(" ")}
                                            </span>
                                        </div>

                                        {/* level 3 */}
                                        {sub.children.length > 0 && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {sub.children.map((child, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <span className="min-w-[3.5rem] text-15">
                                                            {child.split(" ")[0]}
                                                        </span>
                                                        <span className="text-15">
                                                            {child.split(" ").slice(1).join(" ")}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TableContent;
