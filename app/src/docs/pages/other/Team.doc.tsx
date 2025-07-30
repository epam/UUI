import * as React from 'react';
import css from './TeamDoc.module.scss';
import {
    Button, FlexRow, IconContainer, LinkButton, RichTextView, Text,
} from '@epam/uui';
import { ReactComponent as AddIcon } from '@epam/assets/icons/common/action-add-24.svg';
import { ContentSection } from '../../../common';

export const team = [
    {
        name: 'Yakov Zhmurov',
        position: 'Architect',
        isDefault: true,
        src: 'https://static.cdn.epam.com/avatar/779038178a233327b974b53db1836de2.jpg',
        link: 'https://telescope.epam.com/who/Yakov_Zhmourov',
    }, {
        name: 'Ilya Gorchakov',
        position: 'Project Coordinator',
        isDefault: true,
        src: 'https://static.cdn.epam.com/avatar/72202efb63166eb10120ad041f4f676c.jpg',
        link: 'https://telescope.epam.com/who/Ilya_Gorchakov',
    }, {
        name: 'Aliaksei Manetau',
        position: 'Dev Team Lead',
        isDefault: true,
        src: 'https://static.cdn.epam.com/avatar/c13571a6568586868ef45a48ab588df1.jpg',
        link: 'https://telescope.epam.com/who/Aliaksei_Manetau',
    }, {
        name: 'Siarhei Dzeraviannik',
        position: 'Key Developer',
        isDefault: true,
        src: 'https://static.cdn.epam.com/avatar/f63553a885888409e2f88156bcab5fe5.jpg',
        link: 'https://telescope.epam.com/who/Siarhei_Dzeraviannik',
    }, {
        name: 'Ihor Korenets',
        position: 'Developer',
        isDefault: true,
        src: 'https://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Ihor_Korenets.jfif',
        link: 'https://telescope.epam.com/who/Ihor_Korenets',
    }, {
        name: 'Siarhei Yelin',
        position: 'Developer',
        src: 'https://static.cdn.epam.com/avatar/84c839a10f7f76025028844b30512707.jpg',
        link: 'https://telescope.epam.com/who/Siarhei_Yelin',
    }, {
        name: 'Yaroslav Kuznietsov',
        position: 'Key Developer',
        src: 'https://static.cdn.epam.com/avatar/5bd81713fc00b7fac7299fdc0896a796.jpg',
        link: 'https://telescope.epam.com/who/Yaroslav_Kuznietsov',
    }, {
        name: 'Artyom Lezhnyuk',
        position: 'Design Librarian',
        src: 'https://static.cdn.epam.com/avatar/0efe4c3b2e9ee2e393641b9e8c3903e0.jpg',
        link: 'https://telescope.epam.com/who/Artyom_Lezhnyuk',
    }, {
        name: 'Dzmitry Trubchyk',
        position: 'Design Librarian',
        isDefault: true,
        src: 'https://static.cdn.epam.com/avatar/6303e0c4ab6b4ef6ced1f62e5656807a.jpg',
        link: 'https://telescope.epam.com/who/Dzmitry_Trubchyk',
    }, {
        name: 'Natallia Alieva',
        position: 'Tester',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Natallia_Alieva.jfif',
        link: 'https://telescope.epam.com/who/Natallia_Alieva',
    },
];

const contributors = [
    {
        name: 'Vitali Paliakou',
        position: 'Designer',
        src: 'https://static.cdn.epam.com/avatar/1e9763236ec7507df1f6ee218b0620fd.jpg',
        link: 'https://telescope.epam.com/who/Vitali_Paliakou',
    }, {
        name: 'Mikhail Kuznetsov',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Mikhail_Kuznetsov.jfif',
        link: 'https://telescope.epam.com/who/Mikhail_Kuznetsov2',
    }, {
        name: 'Andriana Voloshyn',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Andriana_Voloshyn.jfif',
        link: 'https://telescope.epam.com/who/Andriana_Voloshyn',
    }, {
        name: 'Marianna Zavka',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Marianna_Zavka.jfif',
        link: 'https://telescope.epam.com/who/Marianna_Zavka',
    }, {
        name: 'Oleh Voitkiv',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Oleh_Voitkiv.jfif',
        link: 'https://telescope.epam.com/who/Oleh_Voitkiv',
    }, {
        name: 'Allan Mukanov',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Allan_Mukanov.jfif',
        link: 'https://telescope.epam.com/who/Allan_Mukanov',
    }, {
        name: 'Vladyslav Kruhovyi',
        position: 'Designer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Vladyslav_Kruhovyi.jfif',
        link: 'https://telescope.epam.com/who/Vladyslav_Kruhovyi',
    }, {
        name: 'Nadzeya Nikalayonak',
        position: 'Software Engineer',
        src: 'https://static.cdn.epam.com/avatar/6eb026809e88444eb30dd4e6970d2bc7.jpg',
        link: 'https://telescope.epam.com/who/Nadzeya_Nikalayonak',
    }, {
        name: 'Yuliya Miatlionak',
        position: 'Software Engineer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Yuliya_Miatlionak.jfif',
        link: 'https://telescope.epam.com/who/Yuliya_Miatlionak',
    }, {
        name: 'Dmitrii Savchenko',
        position: 'Software Engineer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Dmitrii_Savchenko.jfif',
        link: 'https://telescope.epam.com/who/Dmitrii_Savchenko',
    }, {
        name: 'Olga Studzenichnik',
        position: 'Software Engineer',
        src: 'http://static.cdn.epam.com/uploads/690afa39a93c88c4dd13758fe1d869d5/EPM-UUI/team-avatars/Olga_Studzenichnik.jfif',
        link: 'https://telescope.epam.com/who/Olga_Studzenichnik',
    }, {
        name: 'Oleksandra Gryshchuk',
        position: 'Software Engineer',
        src: 'https://static.cdn.epam.com/avatar/6a4ee4961e6a290403aa8cb2e567b1d2.jpg',
        link: 'https://telescope.epam.com/who/Oleksandra_Gryshchuk',
    }, {
        name: 'Roman Sribnyi',
        position: 'Software Engineer',
        src: 'https://static.cdn.epam.com/avatar/519232b00824d04a493dc4f58ab3b9f2.jpg',
        link: 'https://telescope.epam.com/who/Roman_Sribnyi',
    },
];

export class TeamDoc extends React.Component {
    render() {
        return (
            <ContentSection>
                <div className={ css.title }>Team</div>
                <RichTextView cx={ css.headerWrapper }>
                    <h2>Core Members</h2>
                </RichTextView>
                <FlexRow cx={ css.teamLayout } alignItems="top">
                    {team.map(({
                        name, position, src, link,
                    }, index) => {
                        return (
                            <div key={ index } className={ css.card }>
                                <img alt={ name } src={ src } width="222" height="222" />
                                <LinkButton size="24" caption={ name } target="_blank" href={ link } />
                                <Text lineHeight="24" fontSize="16" size="none">
                                    {position}
                                </Text>
                            </div>
                        );
                    })}
                </FlexRow>
                <RichTextView cx={ css.headerWrapper }>
                    <h2>Top Contributors</h2>
                </RichTextView>
                <FlexRow cx={ css.teamLayout } alignItems="top">
                    {contributors.map(({
                        name, position, src, link,
                    }, index) => {
                        return (
                            <div key={ index } className={ css.card }>
                                <img alt={ name } src={ src } width="222" height="222" />
                                <LinkButton size="24" caption={ name } target="_blank" href={ link } />
                                <Text lineHeight="24" fontSize="16" size="none">
                                    {position}
                                </Text>
                            </div>
                        );
                    })}
                    <div className={ css.contributeCard }>
                        <IconContainer cx={ [css.iconContainer, css.iconBlue] } icon={ AddIcon } size={ 48 } />
                        <Button cx={ css.link } size="48" fill="ghost" caption="Contribute" target="_blank" href="https://github.com/epam/UUI/blob/main/CONTRIBUTING.md" />
                    </div>
                </FlexRow>
            </ContentSection>
        );
    }
}
