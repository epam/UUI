const { Chance } = require('chance'); // https://chancejs.com/
const { getData } = require('./getData');

const cache = {};

const cached = (key, fn) => {
    return () => {
        if (!cache[key]) {
            return (cache[key] = fn());
        }

        return cache[key];
    };
};

const getCities = cached('cities', async () => {
    const cities = await getData('cities');
    const countries = await getData('countries');
    const countryById = Object.fromEntries(countries.map(c => [c.id, c]));
    cities.forEach(i => (i.countryName = countryById[i.country].name));
    return cities;
});

const getLocationTree = cached('locations', async () => {
    const cities = await getCities();
    const continents = await getData('continents');
    const countries = await getData('countries');

    let list = [];
    list = list.concat(continents.map(c => ({ id: `c-${c.id}`, type: 'continent', name: c.name, parentId: null })));
    list = list.concat(cities.map(c => ({ ...c, id: c.id, name: c.name, type: 'city', parentId: c.country })));
    list = list.concat(countries.map(c => ({ id: c.id, name: c.name, type: 'country', parentId: `c-${c.continent}` })));
    list.forEach(l => {
        l.__typename = 'Location';
    });

    const byId = new Map(list.map(l => [l.id, l]));
    const byParentId = new Map();

    list.forEach(l => {
        if (byParentId.get(l.parentId) == null) {
            byParentId.set(l.parentId, []);
        }
        byParentId.get(l.parentId).push(l);
    });

    return { list, byId, byParentId };
});

const getPersons = cached('persons', async () => {
    const size = 10000;
    const cities = await getCities();
    const c = new Chance(1);

    const companies = [
        {
            id: 1,
            name: c.company(),
        },
    ];

    const jobTitles = jobTitlesWithFrequency.map(({ frequency, ...t }) => t);
    const jobTitlesFreq = jobTitlesWithFrequency.map(jt => jt.frequency);
    const topCities = cities.filter(city => city.population > 400000);
    const statuses = profileStatuses;
    const managers = c.unique(c.name, 30).map((i, index) => ({ id: index, name: i }));
    const offices = c.unique(c.address, 30).map((i, index) => ({ id: index, name: i }));
    const workload = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const persons = [];

    for (let n = 0; n < size; n++) {
        const id = n + 1;
        const firstName = c.first();
        const lastName = c.last();
        const manager = c.pickone(managers);
        const email = `${firstName}_${lastName}@uui.com`;
        const department = c.pickone(departments);
        const city = c.pickone(topCities);
        const office = c.pickone(offices);
        const profileStatus = c.weighted(profileStatuses, [1, 3, 5]);
        const primarySkill = c.pickone(skills);
        const jobTitle =
            n <= 1
                ? jobTitles[n] // CTO and CEO
                : c.weighted(jobTitles, jobTitlesFreq);

        persons.push({
            avatarUrl: `https://avatars.dicebear.com/api/human/${c.guid()}.svg?background=%23EBEDF5&radius=50`,
            birthDate: c.birthday().toDateString(),
            cityId: city.id,
            cityName: city.name,
            countryId: city.country,
            countryName: city.countryName,
            departmentId: department.id,
            departmentName: department.name,
            email,
            employmentStatus: c.bool(),
            firstName,
            hireDate: c.date({ year: c.year({ min: 2010, max: 2020 }) }).toDateString(),
            id,
            jobTitle: jobTitle.name,
            jobTitleId: jobTitle.id,
            lastName,
            locationId: city.id,
            locationName: city.countryName + ', ' + city.name,
            managerId: manager.id,
            managerName: manager.name,
            modifiedDate: c.date({ year: c.year({ min: 2018, max: 2020 }) }).toDateString(),
            name: `${firstName} ${lastName}`,
            officeAddress: office.name,
            officeId: office.id,
            primarySkill: primarySkill.name,
            primarySkillId: primarySkill.id,
            productionCategory: c.bool(),
            profileStatus: profileStatus.name,
            profileStatusId: profileStatus.id,
            relatedNPR: c.bool(),
            salary: c.integer({ min: 0, max: 1500 }),
            titleLevel: `${c.character({ pool: 'AB' })}${c.character({ pool: '1234' })}`,
            uid: c.ssn({ dashes: false }),
            workload: workload[c.integer({ min: 0, max: 10 })],
        });
    }

    const result = { persons, companies, jobTitles, departments, statuses, managers, offices };
    cache[size] = result;
    return result;
});

module.exports = {
    getCities,
    getLocationTree,
    getPersons,
};

const profileStatuses = [
    { id: 1, name: 'Red' },
    { id: 2, name: 'Amber' },
    { id: 3, name: 'Green' },
];

const departments = [
    { id: 12, name: 'Document Control' },
    { id: 1, name: 'Engineering' },
    { id: 16, name: 'Executive' },
    { id: 14, name: 'Facilities and Maintenance' },
    { id: 10, name: 'Finance' },
    { id: 9, name: 'Human Resources' },
    { id: 11, name: 'Information Services' },
    { id: 4, name: 'Marketing' },
    { id: 7, name: 'Production' },
    { id: 8, name: 'Production Control' },
    { id: 5, name: 'Purchasing' },
    { id: 13, name: 'Quality Assurance' },
    { id: 6, name: 'Research and Development' },
    { id: 3, name: 'Sales' },
    { id: 15, name: 'Shipping and Receiving' },
    { id: 2, name: 'Tool Design' },
];

const jobTitlesWithFrequency = [
    { id: 1, name: 'Accountant', frequency: 100 },
    { id: 2, name: 'Accounts Manager', frequency: 20 },
    { id: 3, name: 'Accounts Payable Specialist', frequency: 1000 },
    { id: 4, name: 'Accounts Receivable Specialist', frequency: 100 },
    { id: 5, name: 'Application Specialist', frequency: 500 },
    { id: 6, name: 'Assistant to the Chief Financial Officer', frequency: 3 },
    { id: 7, name: 'Benefits Specialist', frequency: 3 },
    { id: 8, name: 'Buyer', frequency: 20 },
    { id: 9, name: 'Chief Executive Officer', frequency: 0 },
    { id: 10, name: 'Chief Financial Officer', frequency: 0 },
    { id: 11, name: 'Control Specialist', frequency: 50 },
    { id: 12, name: 'Database Administrator', frequency: 300 },
    { id: 13, name: 'Design Engineer', frequency: 300 },
    { id: 14, name: 'Document Control Assistant', frequency: 200 },
    { id: 15, name: 'Document Control Manager', frequency: 400 },
    { id: 16, name: 'Engineering Manager', frequency: 200 },
    { id: 17, name: 'European Sales Manager', frequency: 50 },
    { id: 18, name: 'Facilities Administrative Assistant', frequency: 50 },
    { id: 19, name: 'Facilities Manager', frequency: 50 },
    { id: 20, name: 'Finance Manager', frequency: 50 },
    { id: 21, name: 'Human Resources Administrative Assistant', frequency: 500 },
    { id: 22, name: 'Human Resources Manager', frequency: 500 },
    { id: 23, name: 'Information Services Manager', frequency: 500 },
    { id: 24, name: 'Janitor', frequency: 1000 },
    { id: 25, name: 'Maintenance Supervisor', frequency: 50 },
    { id: 26, name: 'Marketing Assistant', frequency: 400 },
    { id: 27, name: 'Marketing Manager', frequency: 100 },
    { id: 28, name: 'Marketing Specialist', frequency: 400 },
    { id: 29, name: 'Master Scheduler', frequency: 400 },
    { id: 30, name: 'Network Administrator', frequency: 500 },
    { id: 31, name: 'Network Manager', frequency: 500 },
    { id: 32, name: 'North American Sales Manager', frequency: 500 },
    { id: 33, name: 'Pacific Sales Manager', frequency: 500 },
    { id: 34, name: 'Production Control Manager', frequency: 1 },
    { id: 35, name: 'Production Supervisor - WC10', frequency: 200 },
    { id: 36, name: 'Production Supervisor - WC20', frequency: 200 },
    { id: 37, name: 'Production Supervisor - WC30', frequency: 200 },
    { id: 38, name: 'Production Supervisor - WC40', frequency: 200 },
    { id: 39, name: 'Production Supervisor - WC45', frequency: 200 },
    { id: 40, name: 'Production Supervisor - WC50', frequency: 200 },
    { id: 41, name: 'Production Supervisor - WC60', frequency: 200 },
    { id: 42, name: 'Production Technician - WC10', frequency: 1000 },
    { id: 43, name: 'Production Technician - WC20', frequency: 1000 },
    { id: 44, name: 'Production Technician - WC30', frequency: 1000 },
    { id: 45, name: 'Production Technician - WC40', frequency: 1000 },
    { id: 46, name: 'Production Technician - WC45', frequency: 1000 },
    { id: 47, name: 'Production Technician - WC50', frequency: 1000 },
    { id: 48, name: 'Production Technician - WC60', frequency: 1000 },
    { id: 49, name: 'Purchasing Assistant', frequency: 500 },
    { id: 50, name: 'Purchasing Manager', frequency: 500 },
    { id: 51, name: 'Quality Assurance Manager', frequency: 1000 },
    { id: 52, name: 'Quality Assurance Supervisor', frequency: 200 },
    { id: 53, name: 'Quality Assurance Technician', frequency: 400 },
    { id: 54, name: 'Recruiter', frequency: 500 },
    { id: 55, name: 'Research and Development Engineer', frequency: 200 },
    { id: 56, name: 'Research and Development Manager', frequency: 100 },
    { id: 57, name: 'Sales Representative', frequency: 150 },
    { id: 58, name: 'Scheduling Assistant', frequency: 40 },
    { id: 59, name: 'Senior Design Engineer', frequency: 200 },
    { id: 60, name: 'Senior Tool Designer', frequency: 20 },
    { id: 61, name: 'Shipping and Receiving Clerk', frequency: 200 },
    { id: 62, name: 'Shipping and Receiving Supervisor', frequency: 100 },
    { id: 63, name: 'Stocker', frequency: 1000 },
    { id: 64, name: 'Tool Designer', frequency: 10 },
    { id: 65, name: 'Vice President of Engineering', frequency: 1 },
    { id: 66, name: 'Vice President of Production', frequency: 1 },
    { id: 67, name: 'Vice President of Sales', frequency: 1 },
];

const skills = [
    { name: '.NET', id: '.NET' },
    { name: 'Account Management', id: 'Account Management' },
    { name: 'Accounting and Financial', id: 'Accounting and Financial' },
    { name: 'Adobe AEM/CQ (Day CQ)', id: 'Adobe AEM/CQ (Day CQ)' },
    { name: 'Android', id: 'Android' },
    { name: 'Android Kotlin', id: 'Android Kotlin' },
    { name: 'Automated Testing', id: 'Automated Testing' },
    { name: 'Automated Testing in .NET', id: 'Automated Testing in .NET' },
    { name: 'Automated Testing in DSL', id: 'Automated Testing in DSL' },
    { name: 'Automated Testing in JS', id: 'Automated Testing in JS' },
    { name: 'Automated Testing in Java', id: 'Automated Testing in Java' },
    { name: 'Automated Testing in Python', id: 'Automated Testing in Python' },
    { name: 'BI Analyst', id: 'BI Analyst' },
    { name: 'BI Development', id: 'BI Development' },
    { name: 'Big Data', id: 'Big Data' },
    { name: 'Biology', id: 'Biology' },
    { name: 'Business Analysis', id: 'Business Analysis' },
    { name: 'Business Consulting', id: 'Business Consulting' },
    { name: 'Business Development', id: 'Business Development' },
    { name: 'C Programming', id: 'C Programming' },
    { name: 'C++', id: 'C++' },
    { name: 'Chemistry', id: 'Chemistry' },
    { name: 'Cloud.AWS', id: 'Cloud.AWS' },
    { name: 'Cloud.Azure', id: 'Cloud.Azure' },
    { name: 'Cloud.Google', id: 'Cloud.Google' },
    { name: 'DW.MS SQL Server', id: 'DW.MS SQL Server' },
    { name: 'DWBI', id: 'DWBI' },
    { name: 'Data Analytics and Visualization', id: 'Data Analytics and Visualization' },
    { name: 'Data Integration DB and ETL', id: 'Data Integration DB and ETL' },
    { name: 'Data Quality Engineering', id: 'Data Quality Engineering' },
    { name: 'Data Science', id: 'Data Science' },
    { name: 'Data and Business Analysis', id: 'Data and Business Analysis' },
    { name: 'Data entry', id: 'Data entry' },
    { name: 'Delivery Management', id: 'Delivery Management' },
    { name: 'DevOps.BigData', id: 'DevOps.BigData' },
    { name: 'DevOps.CI/CD', id: 'DevOps.CI/CD' },
    { name: 'DevOps.Containers', id: 'DevOps.Containers' },
    { name: 'DevOps.IaC', id: 'DevOps.IaC' },
    { name: 'DevOps.Scripting', id: 'DevOps.Scripting' },
    { name: 'Digital Project Management', id: 'Digital Project Management' },
    { name: 'Drupal', id: 'Drupal' },
    { name: 'Enterprise Analytics', id: 'Enterprise Analytics' },
    { name: 'Front-End Development', id: 'Front-End Development' },
    { name: 'Functional Testing in Mobile', id: 'Functional Testing in Mobile' },
    { name: 'Functional testing', id: 'Functional testing' },
    { name: 'Go Language', id: 'Go Language' },
    { name: 'IT Service Management (ITSM)', id: 'IT Service Management (ITSM)' },
    { name: 'Java', id: 'Java' },
    { name: 'JavaScript', id: 'JavaScript' },
    { name: 'Jurisprudence', id: 'Jurisprudence' },
    { name: 'Language Instruction', id: 'Language Instruction' },
    { name: 'Learning Operations', id: 'Learning Operations' },
    { name: 'Management', id: 'Management' },
    { name: 'Mechanical Engineering', id: 'Mechanical Engineering' },
    { name: 'Microsoft SQL Server', id: 'Microsoft SQL Server' },
    { name: 'Microsoft SharePoint', id: 'Microsoft SharePoint' },
    { name: 'N/A', id: 'N/A' },
    { name: 'Node.js', id: 'Node.js' },
    { name: 'Office Management', id: 'Office Management' },
    { name: 'Oracle', id: 'Oracle' },
    { name: 'Oracle Commerce', id: 'Oracle Commerce' },
    { name: 'Other', id: 'Other' },
    { name: 'PHP', id: 'PHP' },
    { name: 'People Experience and Programs', id: 'People Experience and Programs' },
    { name: 'People Operations', id: 'People Operations' },
    { name: 'People Partnership and Advisory', id: 'People Partnership and Advisory' },
    { name: 'Performance testing', id: 'Performance testing' },
    { name: 'Product Management', id: 'Product Management' },
    { name: 'Project Administration', id: 'Project Administration' },
    { name: 'Project Management', id: 'Project Management' },
    { name: 'Python', id: 'Python' },
    { name: 'RubyOnRails', id: 'RubyOnRails' },
    { name: 'SAP ABAP', id: 'SAP ABAP' },
    { name: 'SAP Commerce Cloud (Hybris Commerce)', id: 'SAP Commerce Cloud (Hybris Commerce)' },
    { name: 'SAP FICO', id: 'SAP FICO' },
    { name: 'SAP Logistics (SCM)', id: 'SAP Logistics (SCM)' },
    { name: 'SET.Java', id: 'SET.Java' },
    { name: 'Sales and Marketing', id: 'Sales and Marketing' },
    { name: 'Salesforce (Other)', id: 'Salesforce (Other)' },
    { name: 'Salesforce Commerce Cloud (B2C - Demandware)', id: 'Salesforce Commerce Cloud (B2C - Demandware)' },
    { name: 'Salesforce Integration Cloud (MuleSoft)', id: 'Salesforce Integration Cloud (MuleSoft)' },
    {
        name: 'Salesforce Primary Clouds (Sales Cloud, Service Cloud, Community Cloud)',
        id: 'Salesforce Primary Clouds (Sales Cloud, Service Cloud, Community Cloud)',
    },
    { name: 'Scala', id: 'Scala' },
    { name: 'Scrum Master', id: 'Scrum Master' },
    { name: 'Security Engineering', id: 'Security Engineering' },
    { name: 'Security Testing', id: 'Security Testing' },
    { name: 'Sitecore', id: 'Sitecore' },
    { name: 'Staffing', id: 'Staffing' },
    { name: 'Support.Application', id: 'Support.Application' },
    { name: 'Support.Data', id: 'Support.Data' },
    { name: 'Support.Infrastructure', id: 'Support.Infrastructure' },
    { name: 'Support.Users', id: 'Support.Users' },
    { name: 'Systems Engineering', id: 'Systems Engineering' },
    { name: 'Talent Acquisition', id: 'Talent Acquisition' },
    { name: 'UX Design', id: 'UX Design' },
    { name: 'Visual Design', id: 'Visual Design' },
    { name: 'WorkFusion', id: 'WorkFusion' },
    { name: 'Writing Technical Documentation (English)', id: 'Writing Technical Documentation (English)' },
    { name: 'iOS Objective-C', id: 'iOS Objective-C' },
    { name: 'iOS Swift', id: 'iOS Swift' },
];
