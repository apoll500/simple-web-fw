// -----------------------------------------------------------------------------
// Reader
// -----------------------------------------------------------------------------
// Reads character by character from a string buffer.
// Different line-endings are unified to single '\n' characters.
//
// The implementation is not fully correct, but sufficiently serves its purpose.
// -----------------------------------------------------------------------------

function Reader(a,ln)
{
    this.ahead=0;
    this.currentChar;
    this.charType=0;
    this.currline=1;
    this.currcolumn=0;
    this.str=a;
    this.readPos=0;
    this.strLength=ln;
    this.get=function()
    {
        if(this.ahead==1)
        {
            this.ahead=0;
            this.moveCursorPos();
            this.charType=0;
            return this.currentChar;
        }
        if(this.getNext())
        {
            if(this.charType==0)
            {
                return this.currentChar;
            }
            return '\n';
        }
        else
        {
            return -1;
        }
    }
    this.getChar=function()
    {
        if(this.getNextChar())return this.currentChar;
        return -1;
    }
    this.getNext=function()
    {
        this.moveCursorPos();
        
        var n=this.getNextChar();

        if(n && this.currentChar=='\n')
        {
            n+=this.getNextChar();
            if(n==2 && this.currentChar=='\r')
            {
                this.charType=3;
                this.ahead=0;
            }
            else if(n==2)
            {
                this.charType=1;
                this.ahead=1;
            }
            else
            {
                this.charType=1;
                this.ahead=-1;
            }
        }
        else if(n && this.currentChar=='\r')
        {
            n+=this.getNextChar();
            if(n==2 && this.currentChar=='\n')
            {
                this.charType=4;
                this.ahead=0;
            }
            else if(n==2)
            {
                this.charType=2;
                this.ahead=1;
            }
            else
            {
                this.charType=2;
                this.ahead=-1;
            }
        }
        else if(n)
        {
            this.charType=0;
            this.ahead=0;
        }
        else
        {
            this.charType=-1;
            this.ahead=0;
        }
        
        return n;
    }
    this.getNextChar=function()
    {
        if(this.readPos<this.strLength)
        {
            this.currentChar=this.str.charAt(this.readPos);
            this.readPos++;
            return 1;
        }
        return 0;
    }
    this.moveCursorPos=function()
    {
        //counting lines and columns.
        this.currcolumn++;
        if(this.charType!=0)
        {
            this.currline++;
            this.currcolumn=1;
        }
    }
}

main_loader.ready();
