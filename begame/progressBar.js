
function ProgressBar(container) {
        var self = this;
        self.bar = document.createElement('div');
        //var text = document.createElement('div');
        
        self.bar.style.width = '0px';
        self.bar.style.height = '100%';
        self.bar.style.background = '#99e';
        
        container.appendChild(self.bar);
        
        /*
        text.style.marginTop = '-20px';
        text.style.textAlign = 'center';
        text.style.color = '#111';
        text.style.textSize = '15px';
        
        text.appendChild(document.createTextNode('0%'));
        
        container.appendChild(text);
        */
}

ProgressBar.prototype.setPercentage = function(percentage) {
    var self = this;
    
    self.bar.style.width = percentage + '%';
    //text.removeChild(text.firstChild);
    //text.appendChild(document.createTextNode(percentage + '%'));
}
