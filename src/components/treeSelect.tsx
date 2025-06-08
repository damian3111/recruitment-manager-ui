import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';

const PROFICIENCY_LEVELS = [
    { value: 'Beginner', label: 'Beginner' },
    { value: 'Familiar', label: 'Familiar' },
    { value: 'Good', label: 'Good' },
    { value: 'Expert', label: 'Expert' },
];

const treeData = [
    {
        title: 'Technologies',
        value: 'technologies',
        selectable: true,
        children: [
            { title: 'React', value: 'react' },
            { title: 'Angular', value: 'angular' },
            { title: 'Vue.js', value: 'vuejs' },
            { title: 'Node.js', value: 'nodejs' },
            { title: 'Django', value: 'django' },
            { title: 'Spring Boot', value: 'spring-boot' },
            { title: 'Docker', value: 'docker' },
            { title: 'Kubernetes', value: 'kubernetes' },
            { title: 'AWS', value: 'aws' },
            { title: 'Azure', value: 'azure' },
            { title: 'Terraform', value: 'terraform' },
            { title: 'GraphQL', value: 'graphql' },
        ],
    },
    {
        title: 'Programming Languages',
        value: 'programming-languages',
        selectable: true,
        children: [
            { title: 'JavaScript', value: 'javascript' },
            { title: 'TypeScript', value: 'typescript' },
            { title: 'Python', value: 'python' },
            { title: 'Java', value: 'java' },
            { title: 'C#', value: 'csharp' },
            { title: 'Go', value: 'go' },
            { title: 'Rust', value: 'rust' },
            { title: 'Kotlin', value: 'kotlin' },
            { title: 'Swift', value: 'swift' },
            { title: 'PHP', value: 'php' },
            { title: 'Ruby', value: 'ruby' },
        ],
    },
    {
        title: 'Languages',
        value: 'languages',
        selectable: true,
        children: [
            { title: 'English', value: 'english' },
            { title: 'Spanish', value: 'spanish' },
            { title: 'Mandarin', value: 'mandarin' },
            { title: 'German', value: 'german' },
            { title: 'French', value: 'french' },
            { title: 'Japanese', value: 'japanese' },
        ],
    },
    {
        title: 'Soft Skills',
        value: 'soft-skills',
        selectable: true,
        children: [
            { title: 'Communication', value: 'communication' },
            { title: 'Teamwork', value: 'teamwork' },
            { title: 'Problem Solving', value: 'problem-solving' },
            { title: 'Adaptability', value: 'adaptability' },
            { title: 'Time Management', value: 'time-management' },
            { title: 'Leadership', value: 'leadership' },
            { title: 'Critical Thinking', value: 'critical-thinking' },
        ],
    },
    {
        title: 'Hard Skills',
        value: 'hard-skills',
        selectable: true,
        children: [
            { title: 'Database Management', value: 'database-management' },
            { title: 'Cybersecurity', value: 'cybersecurity' },
            { title: 'Cloud Computing', value: 'cloud-computing' },
            { title: 'DevOps', value: 'devops' },
            { title: 'Machine Learning', value: 'machine-learning' },
            { title: 'Data Analysis', value: 'data-analysis' },
            { title: 'API Development', value: 'api-development' },
            { title: 'UI/UX Design', value: 'ui-ux-design' },
            { title: 'Network Administration', value: 'network-administration' },
        ],
    },
];

const App: React.FC = () => {
    const [value, setValue] = React.useState<string[]>([]);

    const onChange = (newValue: string[]) => {
        setValue(newValue);
    };

    const suffix = (
        <>
      <span>
        {value.length}
      </span>
            <DownOutlined />
        </>
    );

    return (
        <TreeSelect
            treeData={treeData}
            value={value}
            onChange={onChange}
            multiple
            style={{ width: '100%' }}
            suffixIcon={suffix}
            treeCheckable
            placeholder="Select up to 3 IT skills"
            showCheckedStrategy={TreeSelect.SHOW_CHILD}
        />
    );
};

export default App;