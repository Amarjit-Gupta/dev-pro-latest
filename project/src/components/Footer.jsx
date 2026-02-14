import logo1 from '../assets/Logo-footer.svg';

const Footer = () => {

    return (
        <div className="bg-brand w-full">
            <div className=" w-80 sm:w-160 grid grid-cols-1 sm:grid-cols-2 xl:w-314 xl:grid-cols-4 py-20 bg-brand gap-8 m-auto">
                <div className="">
                    <div className="">
                        <h1 className="text-24 text-primary font-medium">Subscribe for updates</h1>
                        <p className="text-16 text-primary font-regular mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae quibusdam natus molestiae ratione deserunt commodi doloribus, unde reprehenderit eaque quae.</p>
                    </div>
                    <div className=" mt-6">
                        <button className=" py-2 px-8 text-16 text-primary font-medium bg-surface cursor-pointer hover:bg-gray-100">Subscribe Now</button>
                    </div>
                </div>
                <div className="">
                    <h1 className="text-24 text-primary font-medium">Offices</h1>
                    <p className="text-16 text-primary font-semibold mt-2">ABC Mumbai, India</p>
                    <p className="text-16 text-primary font-regular mt-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, expedita.</p>
                </div>
                <div className="">
                    <h1 className="text-24 text-primary font-medium">Integer Reports</h1>
                    <div className=" mt-2 flex justify-between">
                        <div className="">
                            <ul className="text-16 text-primary font-regular flex flex-col gap-2">
                                <li>Industries</li>
                                <li>Countries</li>
                                <li>Report types</li>
                                <li>Trending Ingredient</li>
                                <li>Trending Industry</li>
                                <li>Best Selling</li>
                            </ul>
                        </div>
                        <div className="">
                            <ul className="text-16 text-primary font-regular flex flex-col gap-2">
                                <li>About</li>
                                <li>Contact</li>
                                <li>Privacy Policy</li>
                                <li>Terms & Conditions</li>
                                <li>FAQ</li>
                                <li>Testimonial</li>
                                <li>Our Researchers</li>
                                <li>Methodologies</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className=" flex justify-center xl:justify-end items-center">
                    <div className=" w-50 h-50 bg-brand text-center content-center rounded-full">
                        <img src={logo1} alt="logo" className="h-full w-full rounded-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
