// Generated by CoffeeScript 2.7.0
module.exports = {
  // See `man 3 libcurl-errors`
  error: function(exit_code) {
    switch (exit_code) {
      case 1:
        return 'CURLE_UNSUPPORTED_PROTOCOL';
      case 2:
        return 'CURLE_FAILED_INIT';
      case 3:
        return 'CURLE_URL_MALFORMAT';
      case 4:
        return 'CURLE_NOT_BUILT_IN';
      case 5:
        return 'CURLE_COULDNT_RESOLVE_PROXY';
      case 6:
        return 'CURLE_COULDNT_RESOLVE_HOST';
      case 7:
        return 'CURLE_COULDNT_CONNECT';
      case 8:
        return 'CURLE_FTP_WEIRD_SERVER_REPLY';
      case 9:
        return 'CURLE_REMOTE_ACCESS_DENIED';
      case 10:
        return 'CURLE_FTP_ACCEPT_FAILED';
      case 11:
        return 'CURLE_FTP_WEIRD_PASS_REPLY';
      case 12:
        return 'CURLE_FTP_ACCEPT_TIMEOUT';
      case 13:
        return 'CURLE_FTP_WEIRD_PASV_REPLY';
      case 14:
        return 'CURLE_FTP_WEIRD_227_FORMAT';
      case 15:
        return 'CURLE_FTP_CANT_GET_HOST';
      case 17:
        return 'CURLE_FTP_COULDNT_SET_TYPE';
      case 18:
        return 'CURLE_PARTIAL_FILE';
      case 19:
        return 'CURLE_FTP_COULDNT_RETR_FILE';
      case 21:
        return 'CURLE_QUOTE_ERROR';
      case 22:
        return 'CURLE_HTTP_RETURNED_ERROR';
      case 23:
        return 'CURLE_WRITE_ERROR';
      case 25:
        return 'CURLE_UPLOAD_FAILED';
      case 26:
        return 'CURLE_READ_ERROR';
      case 27:
        return 'CURLE_OUT_OF_MEMORY';
      case 28:
        return 'CURLE_OPERATION_TIMEDOUT';
      case 30:
        return 'CURLE_FTP_PORT_FAILED';
      case 31:
        return 'CURLE_FTP_COULDNT_USE_REST';
      case 33:
        return 'CURLE_RANGE_ERROR';
      case 34:
        return 'CURLE_HTTP_POST_ERROR';
      case 35:
        return 'CURLE_SSL_CONNECT_ERROR';
      case 36:
        return 'CURLE_BAD_DOWNLOAD_RESUME';
      case 37:
        return 'CURLE_FILE_COULDNT_READ_FILE';
      case 38:
        return 'CURLE_LDAP_CANNOT_BIND';
      case 39:
        return 'CURLE_LDAP_SEARCH_FAILED';
      case 41:
        return 'CURLE_FUNCTION_NOT_FOUND';
      case 42:
        return 'CURLE_ABORTED_BY_CALLBACK';
      case 43:
        return 'CURLE_BAD_FUNCTION_ARGUMENT';
      case 45:
        return 'CURLE_INTERFACE_FAILED';
      case 47:
        return 'CURLE_TOO_MANY_REDIRECTS';
      case 48:
        return 'CURLE_UNKNOWN_OPTION';
      case 49:
        return 'CURLE_TELNET_OPTION_SYNTAX';
      case 51:
        return 'CURLE_PEER_FAILED_VERIFICATION';
      case 52:
        return 'CURLE_GOT_NOTHING';
      case 53:
        return 'CURLE_SSL_ENGINE_NOTFOUND';
      case 54:
        return 'CURLE_SSL_ENGINE_SETFAILED';
      case 55:
        return 'CURLE_SEND_ERROR';
      case 56:
        return 'CURLE_RECV_ERROR';
      case 58:
        return 'CURLE_SSL_CERTPROBLEM';
      case 59:
        return 'CURLE_SSL_CIPHER';
      case 60:
        return 'CURLE_SSL_CACERT';
      case 61:
        return 'CURLE_BAD_CONTENT_ENCODING';
      case 62:
        return 'CURLE_LDAP_INVALID_URL';
      case 63:
        return 'CURLE_FILESIZE_EXCEEDED';
      case 64:
        return 'CURLE_USE_SSL_FAILED';
      case 65:
        return 'CURLE_SEND_FAIL_REWIND';
      case 66:
        return 'CURLE_SSL_ENGINE_INITFAILED';
      case 67:
        return 'CURLE_LOGIN_DENIED';
      case 68:
        return 'CURLE_TFTP_NOTFOUND';
      case 69:
        return 'CURLE_TFTP_PERM';
      case 70:
        return 'CURLE_REMOTE_DISK_FULL';
      case 71:
        return 'CURLE_TFTP_ILLEGAL';
      case 72:
        return 'CURLE_TFTP_UNKNOWNID';
      case 73:
        return 'CURLE_REMOTE_FILE_EXISTS';
      case 74:
        return 'CURLE_TFTP_NOSUCHUSER';
      case 75:
        return 'CURLE_CONV_FAILED';
      case 76:
        return 'CURLE_CONV_REQD';
      case 77:
        return 'CURLE_SSL_CACERT_BADFILE';
      case 78:
        return 'CURLE_REMOTE_FILE_NOT_FOUND';
      case 79:
        return 'CURLE_SSH';
      case 80:
        return 'CURLE_SSL_SHUTDOWN_FAILED';
      case 81:
        return 'CURLE_AGAIN';
      case 82:
        return 'CURLE_SSL_CRL_BADFILE';
      case 83:
        return 'CURLE_SSL_ISSUER_ERROR';
      case 84:
        return 'CURLE_FTP_PRET_FAILED';
      case 85:
        return 'CURLE_RTSP_CSEQ_ERROR';
      case 86:
        return 'CURLE_RTSP_SESSION_ERROR';
      case 87:
        return 'CURLE_FTP_BAD_FILE_LIST';
      case 88:
        return 'CURLE_CHUNK_FAILED';
      case 89:
        return 'CURLE_NO_CONNECTION_AVAILABLE';
      default:
        return void 0;
    }
  }
};
