import { Chance } from 'chance'; // https://chancejs.com/
import { indexToOrder } from './indexToOrder';
import { getData } from './getData';

const cache: any = {};

const cached = (key: any, fn: any) => {
    return () => {
        if (!cache[key]) {
            return cache[key] = fn();
        }

        return cache[key];
    };
};

const getCities = cached('cities', async () => {
    const cities: any = await getData('cities');
    const countries: any = await getData('countries');
    const countryById: any = Object.fromEntries(countries.map((c: any) => [c.id, c]));
    cities.forEach((i: any) => i.countryName = countryById[i.country].name);
    return cities;
});

const getLocationTree = cached('locations', async () => {
    const cities: any = await getCities();
    const continents: any = await getData('continents');
    const countries: any = await getData('countries');

    let list: any[] = [];
    list = list.concat(continents.map((c: any) => ({
        id: `c-${c.id}`, type: 'continent', name: c.name, parentId: null,
    })));
    list = list.concat(cities.map((c: any) => ({
        ...c, id: c.id, name: c.name, type: 'city', parentId: c.country,
    })));
    list = list.concat(countries.map((c: any) => ({
        id: c.id, name: c.name, type: 'country', parentId: `c-${c.continent}`,
    })));
    list.forEach((l: any) => { l.__typename = 'Location'; });

    const byId: any = new Map(list.map((l: any) => [l.id, l]));
    const byParentId: any = new Map();

    list.forEach((l: any) => {
        if (byParentId.get(l.parentId) == null) {
            byParentId.set(l.parentId, []);
        }
        byParentId.get(l.parentId).push(l);
    });

    return { list, byId, byParentId };
});

const getPersons = cached('persons', async () => {
    const size = 10000;
    const cities: any = await getCities();
    const c = new Chance(1);

    const companies = [
        {
            id: 1,
            name: c.company(),
        },
    ];

    const jobTitles = jobTitlesWithFrequency.map(({ frequency, ...t }) => t);
    const jobTitlesFreq = jobTitlesWithFrequency.map((jt) => jt.frequency);
    const topCities = cities.filter((city: any) => city.population > 400000);
    const statuses = profileStatuses;
    const managers = c.unique(c.name, 30).map((i: any, index: any) => ({ id: index, name: i }));
    const offices = c.unique(c.address, 30).map((i: any, index: any) => ({ id: index, name: i }));
    const workload = [
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
    ];
    const persons: any[] = [];
    const nationalities = ['en', 'it', 'nl', 'uk', 'de', 'jp', 'es', 'fr'];

    for (let n = 0; n < size; n++) {
        if (n % 1000 === 0) {
            await 0;
        }
        const id = n + 1;
        const firstName = c.first();
        const lastName = c.last({ nationality: c.pickone(nationalities) as any });
        const manager = c.pickone(managers);
        const email = `${firstName}_${lastName}@uui.com`;
        const department = c.pickone(departments);
        const city = c.pickone(topCities);
        const office = c.pickone(offices);
        const profileStatus = c.weighted(profileStatuses, [
            1, 3, 5,
        ]);
        const primarySkill = c.pickone(skills);
        const jobTitle = (n <= 1)
            ? jobTitles[n] // CTO and CEO
            : c.weighted(jobTitles, jobTitlesFreq);

        persons.push({
            avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${c.guid()}&radius=50&randomizeIds=true&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
            birthDate: c.birthday().toDateString(),
            cityId: (city as any).id,
            cityName: (city as any).name,
            countryId: (city as any).country,
            countryName: (city as any).countryName,
            departmentId: (department as any).id,
            departmentName: (department as any).name,
            email,
            employmentStatus: c.bool(),
            firstName,
            hireDate: (c.date({ year: +c.year({ min: 2010, max: 2020 }) }) as Date).toDateString(),
            id,
            jobTitle: (jobTitle as any).name,
            jobTitleId: (jobTitle as any).id,
            lastName,
            locationId: (city as any).id,
            locationName: (city as any).countryName + ', ' + (city as any).name,
            managerId: (manager as any).id,
            managerName: (manager as any).name,
            modifiedDate: (c.date({ year: +c.year({ min: 2018, max: 2020 }) }) as Date).toDateString(),
            name: `${firstName} ${lastName}`,
            officeAddress: (office as any).name,
            officeId: (office as any).id,
            primarySkill: (primarySkill as any).name,
            primarySkillId: (primarySkill as any).id,
            productionCategory: c.bool(),
            profileStatus: (profileStatus as any).name,
            profileStatusId: (profileStatus as any).id,
            relatedNPR: c.bool(),
            salary: c.integer({ min: 0, max: 1500 }),
            titleLevel: `${c.character({ pool: 'AB' })}${c.character({ pool: '1234' })}`,
            uid: c.ssn({ dashes: false }),
            workload: workload[c.integer({ min: 0, max: 10 })],
        });
    }

    const result = {
        persons, companies, jobTitles, departments, statuses, managers, offices,
    };
    cache[size] = result;
    return result;
});

const getProjectTasks = cached('projectTasks', async () => {
    const projectTasks: any = await getData('projectTasks');
    projectTasks.forEach((t: any, index: any) => {
        t.parentId = t.parentId === undefined || t.parentId === null ? null : t.parentId;
        t.order = indexToOrder(index);
    });
    return { projectTasks };
});

export { getCities, getLocationTree, getPersons, getProjectTasks };
export function generateTestData() {
    // ... implementation ...
}

// Export any other functions as needed

const profileStatuses = [
    { id: 1, name: 'Critical' }, { id: 2, name: 'Warning' }, { id: 3, name: 'Success' },
];

const departments = [
    { id: 12, name: 'Document Control' }, { id: 1, name: 'Engineering' }, { id: 16, name: 'Executive' }, { id: 14, name: 'Facilities and Maintenance' }, { id: 10, name: 'Finance' }, { id: 9, name: 'Human Resources' }, { id: 11, name: 'Information Services' }, { id: 4, name: 'Marketing' }, { id: 7, name: 'Production' }, { id: 8, name: 'Production Control' }, { id: 5, name: 'Purchasing' }, { id: 13, name: 'Quality Assurance' }, { id: 6, name: 'Research and Development' }, { id: 3, name: 'Sales' }, { id: 15, name: 'Shipping and Receiving' }, { id: 2, name: 'Tool Design' },
];

const jobTitlesWithFrequency = [
    { id: 1, name: 'Accountant', frequency: 100 }, { id: 2, name: 'Accounts Manager', frequency: 20 }, { id: 3, name: 'Accounts Payable Specialist', frequency: 1000 }, { id: 4, name: 'Accounts Receivable Specialist', frequency: 100 }, { id: 5, name: 'Application Specialist', frequency: 500 }, { id: 6, name: 'Assistant to the Chief Financial Officer', frequency: 3 }, { id: 7, name: 'Benefits Specialist', frequency: 3 }, { id: 8, name: 'Buyer', frequency: 20 }, { id: 9, name: 'Chief Executive Officer', frequency: 0 }, { id: 10, name: 'Chief Financial Officer', frequency: 0 }, { id: 11, name: 'Control Specialist', frequency: 50 }, { id: 12, name: 'Database Administrator', frequency: 300 }, { id: 13, name: 'Design Engineer', frequency: 300 }, { id: 14, name: 'Document Control Assistant', frequency: 200 }, { id: 15, name: 'Document Control Manager', frequency: 400 }, { id: 16, name: 'Engineering Manager', frequency: 200 }, { id: 17, name: 'European Sales Manager', frequency: 50 }, { id: 18, name: 'Facilities Administrative Assistant', frequency: 50 }, { id: 19, name: 'Facilities Manager', frequency: 50 }, { id: 20, name: 'Finance Manager', frequency: 50 }, { id: 21, name: 'Human Resources Administrative Assistant', frequency: 500 }, { id: 22, name: 'Human Resources Manager', frequency: 500 }, { id: 23, name: 'Information Services Manager', frequency: 500 }, { id: 24, name: 'Janitor', frequency: 1000 }, { id: 25, name: 'Maintenance Supervisor', frequency: 50 }, { id: 26, name: 'Marketing Assistant', frequency: 400 }, { id: 27, name: 'Marketing Manager', frequency: 100 }, { id: 28, name: 'Marketing Specialist', frequency: 400 }, { id: 29, name: 'Master Scheduler', frequency: 400 }, { id: 30, name: 'Network Administrator', frequency: 500 }, { id: 31, name: 'Network Manager', frequency: 500 }, { id: 32, name: 'North American Sales Manager', frequency: 500 }, { id: 33, name: 'Pacific Sales Manager', frequency: 500 }, { id: 34, name: 'Production Control Manager', frequency: 1 }, { id: 35, name: 'Production Supervisor - WC10', frequency: 200 }, { id: 36, name: 'Production Supervisor - WC20', frequency: 200 }, { id: 37, name: 'Production Supervisor - WC30', frequency: 200 }, { id: 38, name: 'Production Supervisor - WC40', frequency: 200 }, { id: 39, name: 'Production Supervisor - WC45', frequency: 200 }, { id: 40, name: 'Production Supervisor - WC50', frequency: 200 }, { id: 41, name: 'Production Supervisor - WC60', frequency: 200 }, { id: 42, name: 'Production Technician - WC10', frequency: 1000 }, { id: 43, name: 'Production Technician - WC20', frequency: 1000 }, { id: 44, name: 'Production Technician - WC30', frequency: 1000 }, { id: 45, name: 'Production Technician - WC40', frequency: 1000 }, { id: 46, name: 'Production Technician - WC45', frequency: 1000 }, { id: 47, name: 'Production Technician - WC50', frequency: 1000 }, { id: 48, name: 'Production Technician - WC60', frequency: 1000 }, { id: 49, name: 'Purchasing Assistant', frequency: 500 }, { id: 50, name: 'Purchasing Manager', frequency: 500 }, { id: 51, name: 'Quality Assurance Manager', frequency: 1000 }, { id: 52, name: 'Quality Assurance Supervisor', frequency: 200 }, { id: 53, name: 'Quality Assurance Technician', frequency: 400 }, { id: 54, name: 'Recruiter', frequency: 500 }, { id: 55, name: 'Research and Development Engineer', frequency: 200 }, { id: 56, name: 'Research and Development Manager', frequency: 100 }, { id: 57, name: 'Sales Representative', frequency: 150 }, { id: 58, name: 'Scheduling Assistant', frequency: 40 }, { id: 59, name: 'Senior Design Engineer', frequency: 200 }, { id: 60, name: 'Senior Tool Designer', frequency: 20 }, { id: 61, name: 'Shipping and Receiving Clerk', frequency: 200 }, { id: 62, name: 'Shipping and Receiving Supervisor', frequency: 100 }, { id: 63, name: 'Stocker', frequency: 1000 }, { id: 64, name: 'Tool Designer', frequency: 10 }, { id: 65, name: 'Vice President of Engineering', frequency: 1 }, { id: 66, name: 'Vice President of Production', frequency: 1 }, { id: 67, name: 'Vice President of Sales', frequency: 1 },
];

const skills = [
    { name: '.NET', id: '.NET' }, { name: 'Account Management', id: 'Account Management' }, { name: 'Accounting and Financial', id: 'Accounting and Financial' }, { name: 'Adobe AEM/CQ (Day CQ)', id: 'Adobe AEM/CQ (Day CQ)' }, { name: 'Android', id: 'Android' }, { name: 'Android Kotlin', id: 'Android Kotlin' }, { name: 'Automated Testing', id: 'Automated Testing' }, { name: 'Automated Testing in .NET', id: 'Automated Testing in .NET' }, { name: 'Automated Testing in DSL', id: 'Automated Testing in DSL' }, { name: 'Automated Testing in JS', id: 'Automated Testing in JS' }, { name: 'Automated Testing in Java', id: 'Automated Testing in Java' }, { name: 'Automated Testing in Python', id: 'Automated Testing in Python' }, { name: 'BI Analyst', id: 'BI Analyst' }, { name: 'BI Development', id: 'BI Development' }, { name: 'Big Data', id: 'Big Data' }, { name: 'Biology', id: 'Biology' }, { name: 'Business Analysis', id: 'Business Analysis' }, { name: 'Business Consulting', id: 'Business Consulting' }, { name: 'Business Development', id: 'Business Development' }, { name: 'C Programming', id: 'C Programming' }, { name: 'C++', id: 'C++' }, { name: 'Chemistry', id: 'Chemistry' }, { name: 'Cloud.AWS', id: 'Cloud.AWS' }, { name: 'Cloud.Azure', id: 'Cloud.Azure' }, { name: 'Cloud.Google', id: 'Cloud.Google' }, { name: 'DW.MS SQL Server', id: 'DW.MS SQL Server' }, { name: 'DWBI', id: 'DWBI' }, { name: 'Data Analytics and Visualization', id: 'Data Analytics and Visualization' }, { name: 'Data Integration DB and ETL', id: 'Data Integration DB and ETL' }, { name: 'Data Quality Engineering', id: 'Data Quality Engineering' }, { name: 'Data Science', id: 'Data Science' }, { name: 'Data and Business Analysis', id: 'Data and Business Analysis' }, { name: 'Data entry', id: 'Data entry' }, { name: 'Delivery Management', id: 'Delivery Management' }, { name: 'DevOps.BigData', id: 'DevOps.BigData' }, { name: 'DevOps.CI/CD', id: 'DevOps.CI/CD' }, { name: 'DevOps.Containers', id: 'DevOps.Containers' }, { name: 'DevOps.IaC', id: 'DevOps.IaC' }, { name: 'DevOps.Scripting', id: 'DevOps.Scripting' }, { name: 'Digital Project Management', id: 'Digital Project Management' }, { name: 'Drupal', id: 'Drupal' }, { name: 'Enterprise Analytics', id: 'Enterprise Analytics' }, { name: 'Front-End Development', id: 'Front-End Development' }, { name: 'Functional Testing in Mobile', id: 'Functional Testing in Mobile' }, { name: 'Functional testing', id: 'Functional testing' }, { name: 'Go Language', id: 'Go Language' }, { name: 'IT Service Management (ITSM)', id: 'IT Service Management (ITSM)' }, { name: 'Java', id: 'Java' }, { name: 'JavaScript', id: 'JavaScript' }, { name: 'Jurisprudence', id: 'Jurisprudence' }, { name: 'Language Instruction', id: 'Language Instruction' }, { name: 'Learning Operations', id: 'Learning Operations' }, { name: 'Management', id: 'Management' }, { name: 'Mechanical Engineering', id: 'Mechanical Engineering' }, { name: 'Microsoft SQL Server', id: 'Microsoft SQL Server' }, { name: 'Microsoft SharePoint', id: 'Microsoft SharePoint' }, { name: 'N/A', id: 'N/A' }, { name: 'Node.js', id: 'Node.js' }, { name: 'Office Management', id: 'Office Management' }, { name: 'Oracle', id: 'Oracle' }, { name: 'Oracle Commerce', id: 'Oracle Commerce' }, { name: 'Other', id: 'Other' }, { name: 'PHP', id: 'PHP' }, { name: 'People Experience and Programs', id: 'People Experience and Programs' }, { name: 'People Operations', id: 'People Operations' }, { name: 'People Partnership and Advisory', id: 'People Partnership and Advisory' }, { name: 'Performance testing', id: 'Performance testing' }, { name: 'Product Management', id: 'Product Management' }, { name: 'Project Administration', id: 'Project Administration' }, { name: 'Project Management', id: 'Project Management' }, { name: 'Python', id: 'Python' }, { name: 'RubyOnRails', id: 'RubyOnRails' }, { name: 'SAP ABAP', id: 'SAP ABAP' }, { name: 'SAP Commerce Cloud (Hybris Commerce)', id: 'SAP Commerce Cloud (Hybris Commerce)' }, { name: 'SAP FICO', id: 'SAP FICO' }, { name: 'SAP Logistics (SCM)', id: 'SAP Logistics (SCM)' }, { name: 'SET.Java', id: 'SET.Java' }, { name: 'Sales and Marketing', id: 'Sales and Marketing' }, { name: 'Salesforce (Other)', id: 'Salesforce (Other)' }, { name: 'Salesforce Commerce Cloud (B2C - Demandware)', id: 'Salesforce Commerce Cloud (B2C - Demandware)' }, { name: 'Salesforce Integration Cloud (MuleSoft)', id: 'Salesforce Integration Cloud (MuleSoft)' }, { name: 'Salesforce Primary Clouds (Sales Cloud, Service Cloud, Community Cloud)', id: 'Salesforce Primary Clouds (Sales Cloud, Service Cloud, Community Cloud)' }, { name: 'Scala', id: 'Scala' }, { name: 'Scrum Master', id: 'Scrum Master' }, { name: 'Security Engineering', id: 'Security Engineering' }, { name: 'Security Testing', id: 'Security Testing' }, { name: 'Sitecore', id: 'Sitecore' }, { name: 'Staffing', id: 'Staffing' }, { name: 'Support.Application', id: 'Support.Application' }, { name: 'Support.Data', id: 'Support.Data' }, { name: 'Support.Infrastructure', id: 'Support.Infrastructure' }, { name: 'Support.Users', id: 'Support.Users' }, { name: 'Systems Engineering', id: 'Systems Engineering' }, { name: 'Talent Acquisition', id: 'Talent Acquisition' }, { name: 'UX Design', id: 'UX Design' }, { name: 'Visual Design', id: 'Visual Design' }, { name: 'WorkFusion', id: 'WorkFusion' }, { name: 'Writing Technical Documentation (English)', id: 'Writing Technical Documentation (English)' }, { name: 'iOS Objective-C', id: 'iOS Objective-C' }, { name: 'iOS Swift', id: 'iOS Swift' },
];
