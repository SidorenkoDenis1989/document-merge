export const openInNewTab = (link: string) => {
    const a = document.createElement('a');
    a.setAttribute('target', '_blank');
    a.setAttribute('href', link);
    a.click();
    a.remove();
};
