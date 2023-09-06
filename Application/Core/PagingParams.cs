/*
    the point of this file is to:
        - get the parameters we need from the client OR
        - we need to know what page number they want and we need to know what the page size is 
        - we'll store that information here
*/ 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;

        private int _pageSize = 10;
        public int PageSize
        {
            get { return _pageSize; } // short form: get => _pageSize;
            set { _pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }
    }
}