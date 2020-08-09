var isSideOpen = false;

function toggleSidebar() {
    document.getElementById("sidebar-wrapper").classList.toggle('open');
    isSideOpen = !isSideOpen;
    console.log('ckicked')
}
