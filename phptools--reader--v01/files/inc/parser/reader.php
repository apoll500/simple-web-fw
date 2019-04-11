<?php

// -----------------------------------------------------------------------------
// Reader
// -----------------------------------------------------------------------------
// Reads character by character from a string buffer.
// Different line-endings are unified to single '\n' characters.
//
// The implementation is not fully correct, but sufficiently serves its purpose.
// -----------------------------------------------------------------------------

class Reader
{
    private $ahead=0;
    private $currentChar;
    private $currcolumn=0;
    private $str;
    private $readPos=0;
    private $strLength;
    public $charType=0;
    public $currline=1;
    function __construct($a,$ln)
    {
        $this->str=$a;
        $this->strLength=$ln;
    }
    function get()
    {
        if($this->ahead==1)
        {
            $this->ahead=0;
            $this->moveCursorPos();
            $this->charType=0;
            return $this->currentChar;
        }
        if($this->getNext())
        {
            if($this->charType==0)
            {
                return $this->currentChar;
            }
            return '\n';
        }
        else
        {
            return -1;
        }
    }
    function getChar()
    {
        if($this->getNextChar())return $this->currentChar;
        return -1;
    }
    function getNext()
    {
        $this->moveCursorPos();
        
        $n=$this->getNextChar();

        if($n!=0 && $this->currentChar=='\n')
        {
            $n+=$this->getNextChar();
            if($n==2 && $this->currentChar=='\r')
            {
                $this->charType=3;
                $this->ahead=0;
            }
            else if($n==2)
            {
                $this->charType=1;
                $this->ahead=1;
            }
            else
            {
                $this->charType=1;
                $this->ahead=-1;
            }
        }
        else if($n!=0 && $this->currentChar=='\r')
        {
            $n+=$this->getNextChar();
            if($n==2 && $this->currentChar=='\n')
            {
                $this->charType=4;
                $this->ahead=0;
            }
            else if($n==2)
            {
                $this->charType=2;
                $this->ahead=1;
            }
            else
            {
                $this->charType=2;
                $this->ahead=-1;
            }
        }
        else if($n!=0)
        {
            $this->charType=0;
            $this->ahead=0;
        }
        else
        {
            $this->charType=-1;
            $this->ahead=0;
        }
        
        return $n;
    }
    function getNextChar()
    {
        if($this->readPos<$this->strLength)
        {
            $this->currentChar=$this->str[$this->readPos];
            $this->readPos++;
            return 1;
        }
        return 0;
    }
    function moveCursorPos()
    {
        //counting lines and columns.
        $this->currcolumn++;
        if($this->charType!=0)
        {
            $this->currline++;
            $this->currcolumn=1;
        }
    }
}

?>
