﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace HotChocolate.Transport.Properties {
    using System;
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class TransportAbstractionResoucrces {
        
        private static System.Resources.ResourceManager resourceMan;
        
        private static System.Globalization.CultureInfo resourceCulture;
        
        [System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal TransportAbstractionResoucrces() {
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static System.Resources.ResourceManager ResourceManager {
            get {
                if (object.Equals(null, resourceMan)) {
                    System.Resources.ResourceManager temp = new System.Resources.ResourceManager("HotChocolate.Transport.Properties.TransportAbstractionResoucrces", typeof(TransportAbstractionResoucrces).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        [System.ComponentModel.EditorBrowsableAttribute(System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        internal static string OperationRequest_QueryOrPersistedQueryId {
            get {
                return ResourceManager.GetString("OperationRequest_QueryOrPersistedQueryId", resourceCulture);
            }
        }
        
        internal static string OperationResult_Parse_JsonDataIsEmpty {
            get {
                return ResourceManager.GetString("OperationResult_Parse_JsonDataIsEmpty", resourceCulture);
            }
        }
        
        internal static string FileReference_FileName_NullOrEmpty {
            get {
                return ResourceManager.GetString("FileReference_FileName_NullOrEmpty", resourceCulture);
            }
        }
    }
}
