$.fn.coverFlow = function(options) {
    function buildCoverFlow(elem) {
        var MARGIN_DELTA = 60, //TODO: number taken y observation... get the origin of this
            container = $(elem),
            domStructure = $('<div class="coverFlow"><div><div class="content"><ul class="leftList"></ul><ul class="rightList active"></ul></div></div><p></p></div>'),
            itemStructure = $('<li><div/></li>'),
            reference = domStructure.find('div.content'),
            previousItems = domStructure.find('.leftList'),
            nextItems = domStructure.find('.rightList'),
            info, infoWidth, initialPos;

        function setAfterSlide(currentSlide) {
            var itemWidth = currentSlide.outerWidth(true),
                pos = initialPos + ((infoWidth - itemWidth) / 2) + MARGIN_DELTA - previousItems.width() + (itemWidth * (currentSlide.parent()[0] === previousItems[0] ? 1 : 0));

            reference.css('-webkit-transform', 'translate3d(' + pos + 'px,0px,0px)');
            info.text(currentSlide.find('img').attr('alt'));
        }

        function changeElement(currentList, previousList) {
            if ((currentList.children('li').length > 1) && currentList.hasClass('active')) {
                previousList.addClass('inactive').append(currentList.find('li:last'));
                //force transition refresh
                setTimeout(function() {
                    previousList.removeClass('inactive')
                }, 0);

                setAfterSlide(currentList.find('li:last'));
            } else if (currentList.children('li').length > 0) {
                currentList.addClass('active');
                previousList.removeClass('active');
                setAfterSlide(currentList.find('li:last'));
            }
        }

        function setContent() {
            container.find('img').each(function(index, image) {
                nextItems.prepend(itemStructure.clone(false).children('div').html(image).end());
            });
            container.html(domStructure);
            info = container.find('p');
            infoWidth = info.width();
            initialPos = Math.abs(info.position().left - (container.children('div').position().left));
        }

        function setBindings() {
            container.bind('keyup swipeleft swiperight', function(event) {
                event.preventDefault();
                switch (event.type) {
                case 'swipeleft':
                    changeElement(nextItems, previousItems);
                    break;

                case 'swiperight':
                    changeElement(previousItems, nextItems);
                    break;

                case 'keyup':
                    switch (event.keyCode) {
                    case 37:
                        console.log('left');
                        changeElement(previousItems, nextItems);

                        break;
                    case 39:
                        console.log('right');
                        changeElement(nextItems, previousItems);
                        break;
                    }
                    break;
                }
            })
        }

        (function() {
            setContent();
            setBindings();
            setAfterSlide(nextItems.find('li:last'));
        }())
    }
    return this.each(function() {
        buildCoverFlow(this);
    });
};