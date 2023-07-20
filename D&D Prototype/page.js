const generator = null;

function clear() {
    $('#output').empty();
}

function fill() {
    let $output = $('#output'),
        $w = $(window),
        $b = $('body');
    while (generator && $w.scrollTop() + $w.height() > $b.height()) {
        $output.append($('<li>' + generator + '</li>'));
    }
}

function group(n) {
    let string = n.toString();
    if (/^\d+$/.test(string)) {
        return string.split('').reverse().join('')
            .split(/(\d\d\d)/).filter(function(s) {
                return s !== '';
            }).map(function(s) {
                return s.split('').reverse().join('');
            }).reverse().join(',');
    } else {
        return string;
    }
}

function update(event) {
    if (event) event.preventDefault();
    clear();
    try {
        let spec = $('#spec').val();
        generator = NameGen.compile(spec);
        location.replace('#' + encodeURI(spec));
        $('#spec').removeClass('invalid');
        if (generator.max() === 0) {
            generator = null;
            $('#count').text('');
        } else {
            let count = group(generator.combinations());
            if (count === 1) {
                $('#count').text(count + ' possibility');
            } else {
                $('#count').text(count + ' possibilities');
            }
        }
        fill();
    } catch (e) {
        $('#spec').addClass('invalid');
        $('#count').text('invalid');
    }
}

$(document).ready(function() {
    $('#input').on('submit input change', update);
    $(window).on('scroll', fill);
    $('#help').on('click', function(event) {
        event.preventDefault();
        $('#reference').slideToggle();
    });
    if (location.hash) {
        $('#spec').val(decodeURI(location.hash.substring(1)));
        update();
    }
});
