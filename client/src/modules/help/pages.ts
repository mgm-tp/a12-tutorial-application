interface PageContent {
    [pageName: string]: {
        [locale: string]: string;
    };
}

export const pages: PageContent = {
    help: {
        en: `
![ Help page](/images/help_image.jpg)
# Help page
This is a help page
`,
        de: `
![Hilfeseite](/images/help_image.jpg)
# Hilfeseite
Dies ist eine Hilfeseite
`
    },
    faq: {
        en: `
![FAQ page](/images/faq_image.jpg)
# FAQ page
***Is this an FAQ page?***

Yes
`,
        de: `
![FAQ-Seite](/images/faq_image.jpg)
# FAQ-Seite
***Ist das eine FAQ-Seite?***

Ja
`
    }
};
