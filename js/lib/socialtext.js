/******************************************
 * Social Text
 *
 * Finds the text inside an HTML document that is suitable for
 * social networks, then makes it easy to tweet that text.
 *
 * @author          Paul Ford
 * @copyright       Copyright (c) 2012 Paul Ford.
 * @license         Dual licensed under the MIT and GPL licenses.
 * @link            http://www.savepublishing.com
 * @docs            http://www.savepublishing.com/socialtext
 *
 ******************************************/

(function ($) {


    var words = {
        // Numerals

        'one':1,
        'first':'1st',
        'two':2,
        'second':'2nd',
        'three':3,
        'third':'3rd',
        'four':4,
        'fourth':'4th',
        'five':5,
        'fifth':'5th',
        'six':6,
        'sixth':'6th',
        'seven':7,
        'seventh':'7th',
        'eight':8,
        'eighth':'8th',
        'nine':9,
        'ninth':'9th',
        'ten':10,
        'tenth':'10th',
        'eleven':11,
        'twelve':12,
        'thirteen':13,
        'fourteen':14,
        'fifteen':15,
        'sixteen':16,
        'seventeen':17,
        'eighteen':18,
        'nineteen':19,
        'twenty':20,
        'thirty':30,
        'forty':40,
        'fifty':50,
        'sixty':60,
        'seventy':70,
        'eighty':80,
        'ninety':90,
        'hundred':100,
        'thousand':'1k',
        'million':'mm',
        'billion':'bn',
        'trillion':'trln',

        // Days of week
        'monday':'Mon',
        'tuesday':'Tue',
        'wednesday':'Wed',
        'thursday':'Thu',
        'friday':'Fri',
        'saturday':'Sat',
        'sunday':'Sun',

        // Days of week
        'january':'Jan',
        'february':'Feb',
        'march':'Mar',
        'april':'Apr',
        'may':'May',
        'june':'Jun',
        'july':'Jul',
        'august':'Aug',
        'september':'Sep',
        'october':'Oct',
        'november':'Nov',
        'december':'Dec',

        // Misc terms
        'every':'vry',
        'see':'C',
        'cool':'k',
        'overheard':'OH',
        'whatever':'wtv',
        'your':'Ur',
        'you':'U',
        'about':'abt',
        'because':'b\/c',
        'before':'b4',
        'chk':'chk',
        'to':'2',
        'and':'&',
        'their':'thr',
        'from':'frm',
        'them':'thm',
        'be':'B',
        'large':'lrg',
        'absolute':'abs.',
        'becomes':'bcms',
        'equal':'=',
        'which':'whch',
        'for':'4',
        'are':'R',
        'great':'gr8',
        'at':'@',
        'that':'th@',
        'quarter':'1\/4',
        'half':'1\/2',

        // States
        'Alabama':'AL',
        'Alaska':'AK',
        'Arizona':'AZ',
        'Arkansas':'AR',
        'California':'CA',
        'Colorado':'CO',
        'Connecticut':'CT',
        'Delaware':'DE',
        'District of Columbia':'DC',
        'Florida':'FL',
        'Georgia':'GA',
        'Hawaii':'HI',
        'Idaho':'ID',
        'Illinois':'IL',
        'Indiana':'IN',
        'Iowa':'IA',
        'Kansas':'KS',
        'Kentucky':'KY',
        'Louisiana':'LA',
        'Maine':'ME',
        'Maryland':'MD',
        'Massachusetts':'MA',
        'Michigan':'MI',
        'Minnesota':'MN',
        'Mississippi':'MS',
        'Missouri':'MO',
        'Montana':'MT',
        'Nebraska':'NE',
        'Nevada':'NV',
        'New Hampshire':'NH',
        'New Jersey':'NJ',
        'New Mexico':'NM',
        'New York':'NY',
        'North Carolina':'NC',
        'North Dakota':'ND',
        'Ohio':'OH',
        'Oklahoma':'OK',
        'Oregon':'OR',
        'Pennsylvania':'PA',
        'Rhode Island':'RI',
        'South Carolina':'SC',
        'South Dakota':'SD',
        'Tennessee':'TN',
        'Texas':'TX',
        'Utah':'UT',
        'Vermont':'VT',
        'Virginia':'VA',
        'Washington':'WA',
        'West Virginia':'WV',
        'Wisconsin':'WI',
        'Wyoming':'WY',
        'American Samoa':'AS',
        'Guam':'GU',
        'Northern Mariana Islands':'MP',
        'Puerto Rico':'PR',
        'Virgin Islands':'VI'
    };


    // Matches keys above with word boundaries to left and right

    // Borrowed from underscore.js
    var keys = [];
    for (var key in words) keys[keys.length] = key;
    word_regex = new RegExp('(\\b)(' + keys.join("|") + ')(\\b)', 'gi');


    $.fn.lengthfilter = function (length) {
        var i = 0;

        var $this = this;
        $this.each(function () {
                    $(this).removeClass('socialtext-hide socialtext-show');
                    var css_class = 'socialtext-hide';
                    if ($(this).data('size') < length) {
                        css_class = 'socialtext-show';
                        i++;
                    }
                    $(this).addClass(css_class);

                }
        );
        return i;

    };

    $.fn.score = function (min_score) {

        function _countMatches(arr) {
            return arr ? arr.length : 0;
        }

        $(this)
                .find(":not(iframe)")
                .andSelf()
                .contents()
                .filter(function () {
                    return this.nodeType == 3 && this.nodeValue.match(/\S/);
                })
                .each(function () {
                    var text = this.nodeValue;
                    var punct = _countMatches(text.match(/\w{2}[,;]/g)) + 1;
                    var period = 1 + 2 * _countMatches(text.match(/\w{2}[\.?!;()"“”]/g));
                    var uc = _countMatches(text.match(/[A-Z]/g));
                    var lc = _countMatches(text.match(/[a-z]/g));
                    var spaces = _countMatches(text.match(/[\W]/g));
                    var score = parseInt(punct * period * spaces * lc / (1 + uc));

                    var p = $(this).parent();
                    var s = p.data('score');
                    var s = s ? s : 0;
                    var current_score = s + score;
                    p.data('score', current_score);
                    if (current_score >= min_score && p[0].nodeName != 'BODY') {
                        p.addClass('socialtext-scored');
                    }
                    p.attr('score', current_score);

                });
        return $(this);
    };

    $.fn.header = function () {
        $(this).prepend($('<div id="socialtext-wrapper">')
                .append(
                $('<div id="socialtext-header"/>')
                        .append('<div id="socialtext-reset"><a href="' + location.href + '">Dismiss</a></div>')
                        .append($('<h1><a href="http://www.savepublishing.com">Save Publishing</a></h1>'))
                        .append(
                        $('<form>')
                                .append(
                                $('<span class="socialtext-checkbox"><input type="checkbox" id="socialtext-hide"/> hide untweetable text</span>')
                                        .click(
                                        function () {
                                            hide = hide ? false : true;
                                            $('#socialtext-hide').attr('checked', hide);
                                            if (hide) {
                                                $('img,.socialtext-hide').css({'display':'none'});


                                            }
                                            else {
                                                $('img,.socialtext-hide').css({'display':'inline'});
                                            }
                                        }
                                )

                        )
                                .append(
                                $('<span class="socialtext-checkbox"> <input type="checkbox" id="socialtext-shrink"/> shrink the shrinkable</span>')
                                        .click(
                                        function () {
                                            shrink = shrink ? false : true;
                                            $('#socialtext-shrink').attr('checked', shrink);
                                            if (shrink) {
                                                mark({'squeeze':true});
                                            }
                                            else {
                                                mark({'squeeze':false});

                                            }

                                        }
                                )
                        )

                )
                        .append('<div id="slider-status">Found TK tweetable sentences under 118 characters or less.</div>')
                    // TURN INTO FUNCTION PLEASE
                        .append(
                        $('<div id="socialtext-slider"/>')
                                .slider({ min:0,
                                    max:140,
                                    value:118,
                                    slide:function (event, ui) {

                                        var value = $('.socialtext-statement').lengthfilter(ui.value);

                                        $('#slider-status').html("Found <b>" + value + "</b> statements of " + ui.value + " characters or less.");
                                    }
                                })

                )
                        .append($('<div id="socialtext-footer">From your fine friend <a href="http://twitter.com/ftrain">@ftrain</a> &middot; <a href="http://savepublishing.com/faq">Need help?</a> &middot; <a href="mailto:ford+savepublishing@ftrain.com?subject=[SavePublishing.com] My suggestions">Have suggestions?</a></div>')
                )
        )
        );
        return $(this);
    }
    $.fn.socialtext = function (option, settings) {
        if (typeof option === 'object') {
            settings = option;
        }
        else if (typeof option === 'string') {
            var data = this.data('_socialText');

            if (data) {
                if ($.fn.socialtext.defaultSettings[option] !== undefined) {
                    if (settings !== undefined) {
                        //if you need to make any specific changes to the
                        // DOM make them here
                        data.settings[option] = settings;
                        return true;
                    }
                    else return data.settings[option];
                }
                else return false;
            }
            else return false;
        }

        settings = $.extend({}, $.fn.socialtext.defaultSettings, settings || {});

        return this.each(function () {


            var $elem = $(this);

            var $settings = jQuery.extend(true, {}, settings);

            var socialtext = new SocialText($settings, $elem);
            socialtext.init();

            $elem.data('_socialText', socialtext);
        });
    };

    $.fn.socialtext.defaultSettings = {
        length:118, // The desired length of a sentence
        commas:0,
        semicolons:false,
        periods:true,
        squeeze:false,
        parent:$('body'),
        footer:$('<div id="socialtext-footer">Footer here</div>')
    };

    function SocialText(settings, source) {
        this.source = source;
        this.parsed = null;
        this.settings = settings;
        return this;
    }


    SocialText.prototype =
    {

        init:function () {
            var $this = this;
            if ($this.parsed) return $this.parsed;
            this.divide();
            this.filter();
            return $this;
        },

        _getTextNodes:function () {
            return this
                    .source
                    .find(':not(iframe)')
                    .andSelf()
                    .contents()
                    .filter(function () {
                        return this.nodeType == 3;
                    });

        },

        _parse:function (string) {
            var $this = this;

            string = string.replace(/ +/gi, ' ');

            if ($this.settings.squeeze) string = $this._squeeze(string);

            var statements = [];
            var accum = [];
            var size = 0;
            var in_quote = false;
            var in_parenthesis = false;
            var in_bracket = false;
            var lastcap, lastspace = 0;

            function _glue(statement_type) {
                /**
                 * Glues together statements if it looks like we've reached the
                 * end of a sentence.
                 *
                 * @param {statement_type} One of NEUTRAL, QUESTION,
                 * EXCLAMATION, or QUOTE
                 *
                 */
                var statement_type = statement_type ? statement_type : 'NEUTRAL';
                if (accum.length > 0) {
                    var new_string = accum.join("");
                    new_string = new_string.replace(
                            /([<>"&])/g,
                            function (a) {
                                if (a === '&') return '&amp;';
                                if (a === '<') return '&lt;';
                                if (a === '>') return '&gt;';
                                if (a === '"') return '&quot;';
                            });
                    statements.push({'statement':new_string, 'size':size, 'statement_type':statement_type});
                    accum = [];
                    size = 0;
                }
            }

            function _really(string, i, lastcap) {
                /**
                 *
                 * Is this really the end of a sentence?
                 *
                 * @param {string} string The string we're evaluating
                 * @param {integer} i The number
                 * @param {integer} lastcap The position of the last capital letter
                 *
                 */
                if (string.charAt(i + 1).match(/[\w\)"”]/)
                        || string.charAt(i + 2).match(/[a-z]/)
                        || string.charAt(i + 1).match(/[^\s]/)
                        )
                    return false;
                if (string.charAt(i - 1) === '.') return false;
                if ((i - lastcap) < 4) return false;

                return true;
            }

            for (var i = 0; i < string.length; i++) {
                var char = string.charAt(i);
                size++;
                accum.push(char);

                if (char.match(/[A-Z]/)) lastcap = i;

                switch (char) {
                    case '.':
                        if (!_really(string, i, lastcap)) break;

                        _glue('PERIOD');
                        break;

                    case '!':
                        if (!_really(string, i)) break;
                        _glue('EXCLAMATION');
                        break;

                    case '?':
                        if (!_really(string, i)) break;
                        _glue('QUESTION');
                        break;

                    case ';':
                        if ($this.settings.semicolons > 0
                                && accum.length > $this.settings.semicolons) {
                            _glue('SEMICOLON');
                        }
                        break;

                    case '"':
                        if (in_quote && $this.settings.quotes) {
                            _glue('QUOTE');
                            in_quote = false;
                        }
                        else {
                            in_quote = true;
                        }
                        break;

                    case '“':
                        in_quote = true;
                        break;

                    case '”':
                        if (!_really(string, i)) break;
                        _glue('QUOTE' && $this.settings.quotes);
                        in_quote = false;
                        break;

                    case ',':
                        if (string.charAt(i + 1).match(/[”"]/)) break;


                        if ($this.settings.commas > 0
                                && accum.length < $this.settings.commas
                                && accum.length > 80) {
                            _glue('COMMA');
                        }
                        break;

                    case '—':
                        if ($this.settings.emdashes > 0
                                && accum.length < $this.settings.emdashes
                                && accum.length > 80) {
                            _glue('EMDASH');
                        }
                        break;

                    case '(':
                        in_parenthesis = true;
                        break;
                    case ')':
                        in_parenthesis = false;
                        break;
                    case '[':
                        in_bracket = true;
                        break;
                    case ']':
                        in_bracket = false;
                        break;


                    case ' ':
                        lastspace = i;
                        break;

                    default:
                        break;
                }
            }
            _glue(); //Catch remainder
            return statements;
        },

        _makeUrl:function (statement) {
            statement = $.trim(statement);
            return '<a class="socialtext-statement" style="text-decoration: none;" href="'
                    + 'https://twitter.com/intent/tweet?text='
                    + encodeURI("“" + statement + "”")
                    + '&related=ftrain,savepub'
                    + '&url='
                    + encodeURI(location.href)
                    + '">'
                    + statement
                    + '</a>';
        },

        divide:function () {
            var $this = this;
            var tn = $this._getTextNodes();
            tn.each(function () {
                if (!($(this).parent().hasClass('socialtext-statement'))) {
                    var parsed = $this._parse(this.nodeValue);
                    var newval = $('<span class="socialtext-statement-set"/>');
                    for (i in parsed) {
                        if (parsed[i] && parsed[i].size > 2) {
                            newval.append($($this._makeUrl(parsed[i].statement)).data('size', parsed[i].size));
                        }
                    }
                    $(this).replaceWith(newval);
                }
            });
        },

        _toAbbreviation:function (left, word, right) {
            /* Using the table of abbreviations look up an
             * abbreviation.
             *
             * @param left The left word boundary character
             * @param word The captured term
             * @param right The right word boundary character
             *
             */

            // Regexp passes through all cases so lc
            var lc_word = word.toLowerCase();
            return left + words[lc_word] + right;
        },

        _toFirstSlash:function (str) {
            /**
             * Turns "of" into "o/", etc.
             *
             * @param str The string to enslash
             */
            return str.charAt(0) + '/';

        },

        _squeeze:function (text) {
            /**
             * Converts text
             * @type {*}
             *
             * @param text The text to squeeze.
             *
             */
            $this = this;
            var new_text = text;

            new_text = new_text.replace
                    (
                            word_regex,
                            function (a, b, c, d) {
                                return $this._toAbbreviation(b, c, d);
                            }
                    );
            new_text = new_text.replace
                    (
                            /(with|of)\W/g,
                            function (m) {
                                return $this._toFirstSlash(m);
                            }
                    );
            new_text = new_text.replace(/\s+the\s+/gi, ' ');
            new_text = new_text.replace(/(without)/g, 'w/out');
            new_text = new_text.replace(/e(r|d)(\W)/g, '\$1\$2');
            new_text = new_text.replace(/ has/g, '\'s ');
            new_text = new_text.replace(/est/g, 'st');
            new_text = new_text.replace(/\sam\b/g, '’m');
            new_text = new_text.replace(/\b(will|shall)/g, '’ll');
            new_text = new_text.replace(/\bnot/g, 'n’t');
            new_text = new_text.replace(/e(r|n)(\b)/g, '\$1\$2');
            new_text = new_text.replace(/\sfor/g, ' 4');
            new_text = new_text.replace(/ have/g, '\'ve');
            new_text = new_text.replace(/(1[0-9]|20)/g, function (a) {
                return '&#' + (parseInt(a) + 9311) + ';'
            });
            return new_text;
        },


        filter:function (length) {
            var $this = this;

            var length = (length) ? length : $this.settings.length;


            $this.source.find('.socialtext-statement').each(function () {

                $(this).removeClass('socialtext-hide socialtext-show');
                var css_class = 'socialtext-hide';
                if ($(this).data().size < length) css_class = 'socialtext-show';
                $(this).addClass(css_class);
            });
        },

        _words:function (text) {
            var new_text = text;
            var words = [];
            new_text = new_text.replace(
                    /\b([\w']+)\b/g,
                    function (a) {
                        words.append(a);
                    }
            );
            return new_text;

        }
    }
})(jQuery);