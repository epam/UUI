import * as React from 'react';
import * as css from './TeamDoc.scss';
import { Button, FlexRow, IconContainer, LinkButton, RichTextView, Text } from '@epam/promo';
import * as addIcon from '@epam/assets/icons/common/action-add-24.svg';
import { ContentSection } from '../../common';

export const team = [
    { name: 'Yakov Zhmorov', position: 'Architect', isDefault: true, src: 'https://static.cdn.epam.com/avatar/779038178a233327b974b53db1836de2.jpg', link: 'https://telescope.epam.com/who/Yakov_Zhmourov' },
    { name: 'Aliaksei Manetau', position: 'Dev Team Lead', isDefault: true, src: 'https://static.cdn.epam.com/avatar/c13571a6568586868ef45a48ab588df1.jpg', link: 'https://telescope.epam.com/who/Aliaksei_Manetau' },
    { name: 'Anton Andriushin', position: 'Key Developer', isDefault: true, src: 'https://static.cdn.epam.com/avatar/68a9bcf74f5409f7c034cc68c4813e4e.jpg', link: 'https://telescope.epam.com/who/Anton_Andriushin' },
    { name: 'Siarhei Dzeraviannik', position: 'Developer', isDefault: true, src: 'https://static.cdn.epam.com/avatar/f63553a885888409e2f88156bcab5fe5.jpg', link: 'https://telescope.epam.com/who/Siarhei_Dzeraviannik' },
    { name: 'Fedor Shepelenko', position: 'Head of Products Design', isDefault: false, src: 'https://static.cdn.epam.com/avatar/51b518ca88410daf177874fcdadfe32b.jpg', link: 'https://telescope.epam.com/who/Fedor_Shepelenko' },
    { name: 'Yaroslav Zonov', position: 'Key Designer', isDefault: true, src: 'https://static.cdn.epam.com/avatar/8a4c93a8160c2908ca210174200a395f.jpg', link: 'https://telescope.epam.com/who/Yaroslav_Zonov' },
    { name: 'Ilya Gorchakov', position: 'Project Coordinator', isDefault: true, src: 'https://static.cdn.epam.com/avatar/72202efb63166eb10120ad041f4f676c.jpg', link: 'https://telescope.epam.com/who/Ilya_Gorchakov' },
];

const contributors = [
    { name: 'Artyom Lezhnyuk', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/0efe4c3b2e9ee2e393641b9e8c3903e0.jpg', link: 'https://telescope.epam.com/who/Artyom_Lezhnyuk' },
    { name: 'Stanislau Zeliankou', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/ea2003aa7241ebd786e391090859853d.jpg', link: 'https://telescope.epam.com/who/Stanislau_Zeliankou' },
    { name: 'Svetlana Jeltok', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/a8b6d22931c673a47c6183b4c623e2e9.jpg', link: 'https://telescope.epam.com/who/Svetlana_Jeltok' },
    { name: 'Dzmitry Trubchyk', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/6303e0c4ab6b4ef6ced1f62e5656807a.jpg', link: 'https://telescope.epam.com/who/Dzmitry_Trubchyk' },
    { name: 'Aleksandra Davydova', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/a44025adcb733701630fb7d32a5007bc.jpg', link: 'https://telescope.epam.com/who/Aleksandra_Davydova' },
    { name: 'Vitali Paliakou', position: 'Designer', src: 'https://static.cdn.epam.com/avatar/1e9763236ec7507df1f6ee218b0620fd.jpg', link: 'https://telescope.epam.com/who/Vitali_Paliakou' },
    { name: 'Kanstantsin Babichau', position: 'Software Engineer', src: 'https://static.cdn.epam.com/avatar/e0c6801068d0771d698ee33e4ab645a3.jpg', link: 'https://telescope.epam.com/who/Kanstantsin_Babichau' },
    { name: 'Nadzeya Nikolayonak', position: 'Software Engineer', src: 'https://static.cdn.epam.com/avatar/6eb026809e88444eb30dd4e6970d2bc7.jpg', link: 'https://telescope.epam.com/who/Nadzeya_Nikolayonak' },
];

export class TeamDoc extends React.Component {
    render() {
        return (
            <ContentSection>
                <div className={ css.title }>Team</div>
                <RichTextView cx={ css.headerWrapper } >
                    <h2>Core Members</h2>
                </RichTextView>
                <FlexRow cx={ css.teamLayout } alignItems='top'  >
                    { team.map(({ name, position, src, link }, index) => {
                        return (
                            <div key={ index } className={ css.card } >
                                <img alt={ name } src={ src } width='222' height='222' />
                                <LinkButton size='24' caption={ name } target='_blank' href={ link } />
                                <Text font='sans' lineHeight='24' fontSize='16' size='none' >{ position }</Text>
                            </div>
                        );
                    }) }
                </FlexRow>
                <RichTextView cx={ css.headerWrapper } >
                    <h2>Top Contributors</h2>
                </RichTextView>
                <FlexRow cx={ css.teamLayout } alignItems='top'>
                    { contributors.map(({ name, position, src, link }, index) => {
                        return (
                            <div key={ index } className={ css.card } >
                                <img alt={ name } src={ src } width='222' height='222' />
                                <LinkButton size='24' caption={ name } target='_blank' href={ link } />
                                <Text font='sans' lineHeight='24' fontSize='16' size='none' >{ position }</Text>
                            </div>
                        );
                    }) }
                    <div className={ css.contributeCard } >
                        <IconContainer cx={ css.iconContainer } icon={ addIcon } size={ 48 } color='blue' />
                        <Button cx={ css.link } size='48' fill='light' caption='Contribute' target='_blank' href='https://git.epam.com/epm-tmc/ui/-/issues'  />
                    </div>
                </FlexRow>
            </ContentSection>
        );
    }
}
